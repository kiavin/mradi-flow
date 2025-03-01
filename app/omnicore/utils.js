import Swal from 'sweetalert2';

export function showAlert({
    title = 'Alert',
    text = '',
    icon = 'warning',
    confirmButtonText = 'OK',
    showCancelButton = true,
    confirmButtonColor = '#d33',
    cancelButtonColor = '#076232',
    ...otherOptions
} = {}) {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        showCancelButton,
        confirmButtonColor,
        cancelButtonColor,
        ...otherOptions
    });
}

export function showToast({ title = '', icon = '#fff', timer = 3000, position = 'top' }, background = '#fff', grow = '') {
    return Swal.fire({
        toast: true,
        title,
        icon,
        position,
        timer,
        background,
        grow,
        showConfirmButton: false,
        timerProgressBar: true,
        customClass: {
            popup: 'full-width-toast',
        },
    });
}



