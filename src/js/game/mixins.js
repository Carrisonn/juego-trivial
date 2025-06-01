export const bonusToast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 7000,
  theme: 'dark',
  background: '#582c8a',
  padding: '0.5rem',
  color: '#fff'
});

export const correctAnswerToast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  theme: 'dark',
  background: '#5bbd63',
  padding: '0.5rem',
  color: '#fff'
});

export const errorToast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  background: '#da3a3a',
  padding: '0.5rem',
  color: '#fff'
});

export const skipModal = Swal.mixin({
  titleText: "¿Estás seguro que quieres saltarte la pregunta?",
  text: "Esta acción no se puede deshacer",
  icon: "warning",
  confirmButtonColor: "#49a1e9",
  cancelButtonColor: "#e92f2f",
  confirmButtonText: "Sí, saltar pregunta",
  cancelButtonText: "Cancelar",
  color: '#000',
  background: '#d4d1d1',
  showConfirmButton: true,
  showCancelButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
  heightAuto: false,
});

export const backToMenuModal = Swal.mixin({
  titleText: "¿Estás seguro de volver al menú?",
  text: "Perderás todo el progreso",
  icon: "warning",
  confirmButtonColor: "#49a1e9",
  cancelButtonColor: "#e92f2f",
  confirmButtonText: "Sí, volver al menú",
  cancelButtonText: "Cancelar",
  color: '#000',
  background: '#d4d1d1',
  showConfirmButton: true,
  showCancelButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
  heightAuto: false,
})