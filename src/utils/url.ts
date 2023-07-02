export const isRelaxMode = () => {
  return (
    window.location.pathname === '/relax-mode' ||
    window.location.search === '?relax-mode=1'
  );
};
