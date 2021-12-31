import './App.css';
import Grid from './components/grid/Grid';
import { useState } from 'react';

function App() {
  const colors = ['crimson','dodgerblue','forestgreen']

  const [chosenColor,setChosenColor] = useState('crimson')

  const changeColor = (color) => setChosenColor(color);

  return (
    <div className="App">
      <div className="pallete">
        <h3>Pallete</h3>
        <div className="color-buttons">
        {colors.map(color => (
          <div 
            key={color} 
            onClick={() => changeColor(color)}
            style={{ background: color }}
            className={color === chosenColor ? 'active' : ''}
          />
        ))}
      </div>
      </div>
      <Grid color={chosenColor}/>
    </div>
  );
}

export default App;
