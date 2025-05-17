// @ts-check
import Swal from 'sweetalert2';

/**
 * @typedef {import('sweetalert2').SweetAlertOptions} SweetAlertOptions
 */


/**
 * @param {SweetAlertOptions} options
 */


const Alert = (options) => {
  return Swal.fire({
    ...options,
    showClass: {
      popup: 'swal_fadeIn',
    },
    hideClass: {
      popup: 'swal_fadeOut',
    },
    buttonsStyling: false
  });
};

export default Alert;