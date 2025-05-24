export const getToastStyles = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return {
      borderRadius: '10px',
      background: isDarkMode ? '#30363f' : '#fff', 
      color: isDarkMode ? '#fff' : '#000',
    };
  };