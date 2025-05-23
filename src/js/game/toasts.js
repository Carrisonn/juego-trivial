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
  timer: 4000,
  theme: 'dark',
  background: '#5bbd63',
  padding: '0.5rem',
  color: '#fff'
});

export const errorToast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 4000,
  background: '#da3a3a',
  padding: '0.5rem',
  color: '#fff'
});