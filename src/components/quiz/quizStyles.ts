export const quizStyles = {
  container: `
    w-full max-w-2xl mx-auto
    bg-gradient-to-br from-primary/95 to-secondary/95
    rounded-xl shadow-luxury
    border border-white/10 backdrop-blur-sm
  `,
  optionButton: `
    w-full text-left justify-start p-4 relative overflow-hidden
    transition-all duration-300
    bg-white/10 text-white border-white/10 backdrop-blur-sm hover:bg-white/20
    sm:text-base text-sm group
  `,
  correctOption: `
    bg-gradient-to-r from-green-500/90 to-green-400/90 
    text-white border-white/20
  `,
  incorrectOption: `
    bg-gradient-to-r from-red-500/90 to-red-400/90 
    text-white border-white/20
  `,
  relatedTopicsContainer: `
    mt-6 p-4 bg-white/10 rounded-lg 
    border border-white/20 backdrop-blur-sm
  `
};