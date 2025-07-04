export const toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 6000,
  padding: '0.5rem',
  color: '#fff'
})

export const modal = Swal.mixin({
  cancelButtonText: 'Cancelar',
  icon: 'warning',
  confirmButtonColor: '#49a1e9',
  cancelButtonColor: '#e92f2f',
  color: '#000',
  background: '#d4d1d1',
  showConfirmButton: true,
  showCancelButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
  heightAuto: false
})
