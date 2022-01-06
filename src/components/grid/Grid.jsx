import styles from './Grid.module.css'

import BeforeGrid from '../beforeGrid/BeforeGrid';

import _, { camelCase } from 'lodash';
import { useState, useEffect } from 'react';

const Grid = (props) => {
  const [targetColor, setTargetColor] = useState('crimson')
  const [width, setWidth] = useState('')
  const [gridX, setGridX] = useState('')
  const [gridY, setGridY] = useState('')
  const [beforeGrid, setBeforeGrid] = useState(null)
  const [renderGrid, setRenderGrid] = useState(null)

  const [showContent, setShowContent] = useState(false)

  const [paintX, setPaintX] = useState(null)
  const [paintY, setPaintY] = useState(null)

  const COLORS = [
    'crimson',
    'dodgerblue',
    'forestgreen'
  ]

  function generateRandomGrid(rows, columns) {
    // The 2D array which will be used to store the randomly generated color values
    var grid = []

    // Move row by row and populate each point in the row with a random color
    for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
      // Create the array at this row which represents the column
      grid[rowIndex] = []

      // Go through each point in the column
      for (var columnIndex = 0; columnIndex < columns; columnIndex++) {
        // Generate the random color for the point at rowIndex,columnIndex
        var colorForCurrentCoord = COLORS[_.random(0, 2)]

        // Set the color
        grid[rowIndex][columnIndex] = colorForCurrentCoord
      }
    }

    // Return the generated grid
    return grid
  }

  function floodFillAt(grid, x, y, color) {
    const originalColor = grid[x][y]

    // inner pixels
    let usedPixels = []
    // outer pixcels with the same color
    let curPixels = [`${x}-${y}`]
    // all outer pixels the algorithm applying to
    let newPixels = []

    const xMaxIndex = grid.length - 1
    const yMaxIndex = grid[0].length - 1

    // obtain the adjacent pixels(8 or less)
    const getAdjacentPixels = (pixelX, pixelY) => {
      const arr = [
        `${pixelX - 1}-${pixelY - 1}`, `${pixelX - 1}-${pixelY}`, `${pixelX - 1}-${pixelY + 1}`,
        `${pixelX}-${pixelY - 1}`, `${pixelX}-${pixelY + 1}`,
        `${pixelX + 1}-${pixelY - 1}`, `${pixelX + 1}-${pixelY}`, `${pixelX + 1}-${pixelY + 1}`
      ]
      // delete those pixcels on the edge
      if (pixelX === 0) {
        delete arr[0]
        delete arr[1]
        delete arr[2]
      }
      if (pixelX === xMaxIndex) {
        delete arr[5]
        delete arr[6]
        delete arr[7]
      }
      if (pixelY === 0) {
        delete arr[0]
        delete arr[3]
        delete arr[5]
      }
      if (pixelY === yMaxIndex) {
        delete arr[2]
        delete arr[4]
        delete arr[7]
      }
      return arr.filter(() => true) // obtain the regular array instead of the having some null
    }

    do {
      const newPixelsSet = new Set()
      // obtain all the spread unique pixcels(including both inner and outer)
      curPixels.forEach(pixel => {
        const [pixelX, pixelY] = pixel.split('-')
        const adjacentPixels = getAdjacentPixels(+pixelX, +pixelY)
        adjacentPixels.forEach(item => newPixelsSet.add(item))
      })
      // reset the inner pixels
      usedPixels = [...usedPixels, ...curPixels]
      // obtain all the spread outer pixels
      newPixels = [...newPixelsSet].filter(pixel => !usedPixels.includes(pixel))
      // filter the outer pixels with the same color
      curPixels = newPixels.filter(pixel => {
        const [pixelX, pixelY] = pixel.split('-')
        return grid[pixelX][pixelY] === originalColor
      })
    } while (curPixels.length)

    usedPixels.forEach(pixel => {
      const [pixelX, pixelY] = pixel.split('-')
      grid[pixelX][pixelY] = color
    })

    return grid
  }

  const renderInit = e => {
    e.preventDefault()
    if (gridX >= 1 && gridY >= 1) {
      setWidth(gridX)
      const init = generateRandomGrid(gridY, gridX);
      setGridX('');
      setGridY('');
      setBeforeGrid(null)
      setRenderGrid(init)
      console.log('init ', init)
    }
  }

  const selectStart = e => {
    const [co, x, y] = e.target.className.split('-')
    setPaintX(x)
    setPaintY(y)
  }

  const startPaint = () => {
    // setTargetColor(props.color)
    setBeforeGrid(_.cloneDeep(renderGrid))
    setRenderGrid(renderGrid => floodFillAt([...renderGrid], paintX - 1, paintY - 1, props.color))
  }

  // useEffect(() => {
  //     if (paintX >= 1 && paintY >= 1) {
  //         // setRenderGrid(rendergrid => floodFillAt(rendergrid, paintX, paintY, targetColor))
  //         console.log(floodFillAt(renderGrid, paintX, paintY, targetColor))
  //     }
  // }, [targetColor])

  return (
    <div className={styles.grid}>
      <form onSubmit={renderInit}>
        <div className={styles.input}>
          <label>Grid Width:</label>
          <input
            type="number"
            min="1"
            step='1'
            value={gridX}
            onChange={(e) => setGridX(e.target.value)}
          />
          <label>Grid Height:</label>
          <input
            type="number"
            min="1"
            step='1'
            value={gridY}
            onChange={(e) => setGridY(e.target.value)}
          />
        </div>
        <div>
          <button onClick={renderInit}>Render initial grid</button>
          <button onClick={() => setShowContent(!showContent)} disabled={renderGrid ? false : true}>Toggle grid content</button>
        </div>
        {paintX && paintY ?
          <div>Ready to start paint at {paintX},{paintY} ?</div>
          :
          <div>Please select the start pixel</div>}
        <button
          onClick={startPaint}
          disabled={paintX && paintY ? false : true}
        >Start paint</button>
      </form>
      {renderGrid &&
        <table style={{ width: `${2.2 * width}rem` }}>
          <tbody>
            {renderGrid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    style={{ background: cell }}
                    className={`td-${rowIndex + 1}-${colIndex + 1}`}
                    onClick={selectStart}
                  >
                    {showContent ? `${rowIndex + 1}, ${colIndex + 1}` : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>}
      {beforeGrid && <BeforeGrid beforegrid={beforeGrid} showContent={showContent} width={width} />}
    </div>
  );
}

export default Grid;