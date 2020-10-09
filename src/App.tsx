import React from 'react';

export const App: React.FC = React.memo(() => {
  return <div className="App">Hello World</div>;
});
App.displayName = 'App';
