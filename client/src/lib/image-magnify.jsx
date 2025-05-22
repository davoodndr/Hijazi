import { useRef, useState, useCallback, useEffect } from 'react';

// useMouse Hook
function useMouse(options = { resetOnExit: false }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const requestRef = useRef(null);
  const positionRef = useRef(position);

  const setMousePosition = useCallback((event) => {
    if (ref.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.round(event.pageX - rect.left - (window.pageXOffset || window.scrollX))
      );
      const y = Math.max(
        0,
        Math.round(event.pageY - rect.top - (window.pageYOffset || window.scrollY))
      );
      positionRef.current = { x, y };
    } else {
      positionRef.current = { x: event.clientX, y: event.clientY };
    }
    if (requestRef.current === null) {
      requestRef.current = requestAnimationFrame(() => {
        setPosition(positionRef.current);
        requestRef.current = null;
      });
    }
  }, []);

  const resetMousePosition = useCallback(() => {
    positionRef.current = { x: 0, y: 0 };
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current || document;
    element.addEventListener('mousemove', setMousePosition);
    if (options.resetOnExit) element.addEventListener('mouseleave', resetMousePosition);
    return () => {
      element.removeEventListener('mousemove', setMousePosition);
      if (options.resetOnExit) element.removeEventListener('mouseleave', resetMousePosition);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [setMousePosition, resetMousePosition, options.resetOnExit]);

  return { ref, ...position };
}

// EasySkeleton Component
function EasySkeleton(props) {
  const { className, backgroundColor, animation, ...other } = props;
  return (
    <div
      className={`easyPulseSkeleton w-full h-full ${className}`}
      style={{
        backgroundColor: backgroundColor || '#0000001c',
        animation: animation || 'pulse 2s ease-in-out 0.5s infinite',
      }}
      {...other}
    />
  );
}

// createStore Utility
function createStore(initialState) {
  const listeners = new Set();
  let batching = false;
  let state = initialState;
  let updatedProperties;

  const setState = (extraState = {}) => {
    updatedProperties = { ...updatedProperties, ...extraState };
    flush();
  };

  const flush = () => {
    if (batching) return;
    let hasChanged = false;
    if (updatedProperties) {
      for (const key in updatedProperties) {
        if (state[key] !== updatedProperties[key]) {
          hasChanged = true;
          break;
        }
      }
    }
    if (!hasChanged) return;
    state = { ...state, ...updatedProperties };
    listeners.forEach((listener) => listener({ state, updatedProperties }));
    updatedProperties = undefined;
  };

  const batch = (cb) => {
    batching = true;
    cb();
    batching = false;
    flush();
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const cleanup = () => listeners.clear();
  const getState = () => state;

  return { subscribe, cleanup, getState, setState, batch };
}

// imageLoader Utility
const THRESHOLD = 50;
function makeImageLoader() {
  const createZoomImage = (img, src, store) => {
    if (img.src === src) return;
    img.src = src;
    let complete = false;
    img.onload = () => {
      complete = true;
      store.setState({ zoomedImgStatus: 'loaded' });
    };
    img.onerror = () => {
      complete = true;
      store.setState({ zoomedImgStatus: 'error' });
    };
    setTimeout(() => {
      if (!complete) store.setState({ zoomedImgStatus: 'loading' });
    }, THRESHOLD);
  };
  return { createZoomImage };
}
const imageLoader = makeImageLoader();

// clamp and Other Utilities
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function disableScroll() {
  const controller = new AbortController();
  const { signal } = controller;
  window.addEventListener('DOMMouseScroll', (e) => e.preventDefault(), { signal });
  window.addEventListener('wheel', (e) => e.preventDefault(), { passive: false, signal });
  window.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false, signal });
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
    }
  }, { signal });
  return controller;
}

function enableScroll(controller) {
  controller?.abort();
}

function getSourceImage(container) {
  if (!container) throw new Error('Please specify a container for the zoom image');
  const sourceImgElement = container.querySelector('img');
  if (!sourceImgElement) throw new Error('Please place an image inside the container');
  return sourceImgElement;
}

// createZoomImageHover
function createZoomImageHover(container, options) {
  const controller = new AbortController();
  const { signal } = controller;
  const sourceImgElement = getSourceImage(container);
  const zoomedImgWrapper = document.createElement('div');
  zoomedImgWrapper.style.overflow = 'hidden';
  const zoomedImg = zoomedImgWrapper.appendChild(document.createElement('img'));
  zoomedImg.alt = options.zoomImageProps?.alt || '';
  zoomedImg.style.maxWidth = 'none';
  zoomedImg.style.display = 'none';
  const zoomLens = container.appendChild(document.createElement('div'));
  zoomLens.style.display = 'none';
  zoomedImg.id = 'meroZoomedImg';
  let sourceImageElementWidth = 0;
  let sourceImageElementHeight = 0;

  const finalOptions = {
    zoomImageSource: options.zoomImageSource || sourceImgElement.src,
    zoomLensClass: options.zoomLensClass || '',
    zoomTargetClass: options.zoomTargetClass || '',
    customZoom: options.customZoom,
    scale: options.scale || 2,
    zoomTarget: options.zoomTarget,
    zoomLensScale: options.zoomLensScale || 1,
    disableScrollLock: options.disableScrollLock || false,
  };

  const { scale, zoomImageSource, customZoom, zoomLensClass, zoomTarget, zoomLensScale, zoomTargetClass, disableScrollLock } = finalOptions;

  const store = createStore({
    zoomedImgStatus: 'idle',
    enabled: true,
  });

  let offset = getOffset(sourceImgElement);
  let scrollController = null;

  function getOffset(element) {
    const elRect = element.getBoundingClientRect();
    return { left: elRect.left, top: elRect.top };
  }

  function getLimitX(value) {
    return sourceImageElementWidth - value;
  }

  function getLimitY(value) {
    return sourceImageElementHeight - value;
  }

  function zoomLensLeft(left) {
    const halfLensWidth = zoomLens.clientWidth / 2;
    const maxLeft = sourceImageElementWidth - 1 - halfLensWidth;
    return clamp(left, halfLensWidth, maxLeft) - halfLensWidth;
  }

  function zoomLensTop(top) {
    const halfLensHeight = zoomLens.clientHeight / 2;
    const maxTop = sourceImageElementHeight - 1 - halfLensHeight;
    return clamp(top, halfLensHeight, maxTop) - halfLensHeight;
  }

  function processZoom(event) {
    let offsetX;
    let offsetY;
    let backgroundX;
    let backgroundY;
    if (offset) {
      offsetX = zoomLensLeft(event.clientX - offset.left);
      offsetY = zoomLensTop(event.clientY - offset.top);
      backgroundX = offsetX * scale / zoomLensScale;
      backgroundY = offsetY * scale / zoomLensScale;
      zoomedImg.style.transform = `translate(${-Math.floor(backgroundX)}px, ${-Math.floor(backgroundY)}px)`;
      zoomLens.style.cssText += `transform:translate(${offsetX}px, ${offsetY}px);`;
    }
  }

  async function handlePointerEnter() {
    imageLoader.createZoomImage(zoomedImg, zoomImageSource, store);
    zoomedImg.style.display = 'block';
    zoomLens.style.display = 'block';
    if (zoomTargetClass) {
      zoomTarget.classList.add(...zoomTargetClass.split(' '));
    }
    if (!disableScrollLock) scrollController = disableScroll();
  }

  function handlePointerLeave() {
    zoomedImg.style.display = 'none';
    zoomLens.style.display = 'none';
    if (zoomTargetClass) {
      zoomTarget.classList.remove(...zoomTargetClass.split(' '));
    }
    if (!disableScrollLock && scrollController) {
      enableScroll(scrollController);
      scrollController = null;
    }
  }

  function handleScroll() {
    offset = getOffset(sourceImgElement);
  }

  async function setup() {
    if (zoomLensClass) {
      zoomLens.className = zoomLensClass;
    } else {
      zoomLens.className = 'easy-zoom-lens';
      zoomLens.style.cursor = 'pointer';
    }
    container.addEventListener('pointerdown', processZoom, { signal });
    container.addEventListener('pointermove', processZoom, { signal });
    container.addEventListener('pointerenter', handlePointerEnter, { signal });
    container.addEventListener('pointerleave', handlePointerLeave, { signal });
    window.addEventListener('scroll', handleScroll, { signal });
    zoomTarget.appendChild(zoomedImgWrapper);
    await new Promise((resolve) => setTimeout(resolve, 1));
    sourceImageElementWidth = sourceImgElement.clientWidth;
    sourceImageElementHeight = sourceImgElement.clientHeight;
    if (customZoom) {
      zoomedImgWrapper.style.width = customZoom.width + 'px';
      zoomedImgWrapper.style.height = customZoom.height + 'px';
    } else {
      zoomedImgWrapper.style.width = sourceImageElementWidth + 'px';
      zoomedImgWrapper.style.height = sourceImageElementHeight + 'px';
    }
    
    zoomedImg.width = Math.ceil((sourceImageElementWidth * scale / zoomLensScale)) + 3;
    zoomedImg.height = Math.ceil((sourceImageElementHeight * scale / zoomLensScale)) + 3;

    const sourceImageRect = sourceImgElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const fromLeft = sourceImageRect.left - containerRect.left;
    const fromTop = sourceImageRect.top - containerRect.top;
    zoomTarget.style.pointerEvents = 'none';
    zoomLens.style.position = 'absolute';
    zoomLens.style.left = fromLeft + 'px';
    zoomLens.style.top = fromTop + 'px';
    zoomLens.style.width = (customZoom.width / scale * zoomLensScale) + 'px';
    zoomLens.style.height = (customZoom.height / scale * zoomLensScale) + 'px';
  }

  setup();

  return {
    cleanup: () => {
      controller.abort();
      if (container.contains(zoomLens)) container.removeChild(zoomLens);
      if (zoomTarget && zoomTarget.contains(zoomedImgWrapper)) {
        zoomTarget.removeChild(zoomedImgWrapper);
      } else if (container.contains(zoomedImgWrapper)) {
        container.removeChild(zoomedImgWrapper);
      }
    },
    subscribe: store.subscribe,
    getState: store.getState,
    setState: (newState) => store.setState(newState),
  };
}

// useZoomImageHover Hook
function useZoomImageHover() {
  const result = useRef();
  const [zoomImageState, updateZoomImageState] = useState({
    enabled: false,
    zoomedImgStatus: 'idle',
  });
  const createZoomImage = useCallback((...arg) => {
    if (result.current) result.current.cleanup();
    result.current = createZoomImageHover(...arg);
    updateZoomImageState(result.current.getState());
    result.current.subscribe(({ state }) => updateZoomImageState(state));
  }, []);
  useEffect(() => {
    return () => {
      if (result.current) result.current.cleanup();
    };
  }, []);
  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState: result.current?.setState || (() => {}),
  };
}

// ImageZoomOnHover Component
const ImageZoomOnHover = function ImageZoomOnHover(
  {
    mainImage,
    zoomImage,
    loadingIndicator,
    delayTimer,
    distance = 10,
    zoomContainerWidth,
    zoomContainerHeight,
    zoomLensScale,
    className = '',
    zoomClass = '',
  }) {
  const { createZoomImage } = useZoomImageHover();
  const imageHoverContainerRef = useRef(null);
  const zoomTargetRef = useRef(null);
  const imgRef = useRef(null);
  const [imageDimension, setImageDimensions] = useState({ height: 0, width: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateDimensions = useCallback(() => {
    if (imgRef.current && imageHoverContainerRef.current) {
      const { clientWidth, clientHeight } = imgRef.current;
      setImageDimensions({ width: clientWidth, height: clientHeight });
    }
  }, []);

  const handleImageLoad = async () => {
    if (imgRef.current) {
      updateDimensions();
      //await delay(delayTimer || 1600);
      setIsImageLoaded(true);
    }
  };

  useEffect(() => {
    const container = imageHoverContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [updateDimensions]);

  useEffect(() => {
    if (imageDimension.width > 0 && imageDimension.height > 0) {
      const imageContainer = imageHoverContainerRef.current;
      const zoomTarget = zoomTargetRef.current;
      createZoomImage(imageContainer, {
        zoomImageSource: zoomImage.src || mainImage.src,
        customZoom: {
          width: zoomContainerWidth || imageDimension.width || 450,
          height: zoomContainerHeight || imageDimension.height || 470,
        },
        zoomTarget,
        scale: zoomLensScale || 3,
      });
    }
  }, [isImageLoaded, imageDimension, createZoomImage, mainImage.src, zoomImage.src, zoomContainerWidth, zoomContainerHeight, zoomLensScale]);

  return (
    <>
      {!isImageLoaded && (
        loadingIndicator || (
          <EasySkeleton/>
        )
      )}
      <div
        ref={imageHoverContainerRef}
        className={`EasyZoomImageHoverMainContainer ${className}`}
        style={{
          position: 'relative',
          display: isImageLoaded ? 'flex' : 'none',
          justifyItems: 'start',
        }}
      >
        <img
          className="EasyZoomHoverSmallImage w-full h-full object-contain smooth"
          onLoad={handleImageLoad}
          ref={imgRef}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          alt={mainImage.alt || 'Small Pic'}
          src={mainImage.src}
        />
        <div
          ref={zoomTargetRef}
          className={`EasyZoomImageZoomHoverContainer ${zoomClass}`}
          id="zoomTargeted"
          style={{
            position: 'absolute',
            width: zoomContainerWidth || `${imageDimension.width}px`,
            height: zoomContainerHeight || `${imageDimension.height}px`,
            left: `calc(100% + ${distance}px)`, // Position relative to container
            top: 0,
            zIndex: 10, // Ensure visibility
          }}
        />
      </div>
    </>
  );
};

export default ImageZoomOnHover

export { ImageZoomOnHover, EasySkeleton };