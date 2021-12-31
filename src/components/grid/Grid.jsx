import styles from './Grid.module.css'

import BeforeGrid from '../beforeGrid/BeforeGrid';

import _, { camelCase } from 'lodash';
import { useState, useEffect } from 'react';

const Grid = ({ color }) => {
    const [width, setWidth] = useState('')
    const [gridX, setGridX] = useState('')
    const [gridY, setGridY] = useState('')
    const [beforeGrid, setBeforeGrid] = useState(null)
    const [renderGrid, setRenderGrid] = useState(null)
    const [tempGrid, setTempGrid] = useState(null)

    const [showContent, setShowContent] = useState(false)

    const [paintX, setPaintX] = useState(null)
    const [paintY, setPaintY] = useState(null)
    const [sColor, setSColor] = useState(null)

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

    const renderInit = () => {
        if (gridX && gridY) {
            setWidth(gridX)
            const init = generateRandomGrid(gridY, gridX);
            setGridX('');
            setGridY('');
            setBeforeGrid(null)
            setRenderGrid(init)
            setTempGrid(init)
        }
    }

    const paintAdjacentAuto = pixel => {
        const [co, x, y] = pixel.className.split('-')
        pixel.style.background = color

        // let newTemp = [...renderGrid]
        // newTemp[x - 1][y - 1] = color
        // setRenderGrid(newTemp)

        // e.target.classList.add('painted')

        const t = document.querySelector('tbody')
        const lastD = t.getElementsByTagName('tr')[x - 2]
        const currD = t.getElementsByTagName('tr')[x - 1]
        const nextD = t.getElementsByTagName('tr')[x]

        const adjacent = []

        if (lastD) {
            adjacent.push(lastD.getElementsByTagName('td')[y - 2])
            adjacent.push(lastD.getElementsByTagName('td')[y - 1])
            adjacent.push(lastD.getElementsByTagName('td')[y])
        } else {
            adjacent.push(null, null, null)
        }

        adjacent.push(currD.getElementsByTagName('td')[y - 2])
        adjacent.push(currD.getElementsByTagName('td')[y])

        if (nextD) {
            adjacent.push(nextD.getElementsByTagName('td')[y - 2])
            adjacent.push(nextD.getElementsByTagName('td')[y - 1])
            adjacent.push(nextD.getElementsByTagName('td')[y])
        } else {
            adjacent.push(null, null, null)
        }

        adjacent.forEach(cell => {
            if (cell) {
                if (cell.style.background === sColor) {
                    // cell.style.background = color
                    // cell.classList.add('painted')
                    paintAdjacentAuto(cell)
                }
            }
        })
    }

    const paint = () => {
        setBeforeGrid(tempGrid)

        const self = document.querySelector(`.td-${paintX}-${paintY}`)
        self.style.background = color
        // let newTemp = [...renderGrid]
        // newTemp[paintX - 1][paintY - 1] = color
        // setRenderGrid(newTemp)

        // e.target.classList.add('painted')

        const t = document.querySelector('tbody')
        const lastD = t.getElementsByTagName('tr')[paintX - 2]
        const currD = t.getElementsByTagName('tr')[paintX - 1]
        const nextD = t.getElementsByTagName('tr')[paintX]

        const adjacent = []

        if (lastD) {
            adjacent.push(lastD.getElementsByTagName('td')[paintY - 2])
            adjacent.push(lastD.getElementsByTagName('td')[paintY - 1])
            adjacent.push(lastD.getElementsByTagName('td')[paintY])
        } else {
            adjacent.push(null, null, null)
        }

        adjacent.push(currD.getElementsByTagName('td')[paintY - 2])
        adjacent.push(currD.getElementsByTagName('td')[paintY])

        if (nextD) {
            adjacent.push(nextD.getElementsByTagName('td')[paintY - 2])
            adjacent.push(nextD.getElementsByTagName('td')[paintY - 1])
            adjacent.push(nextD.getElementsByTagName('td')[paintY])
        } else {
            adjacent.push(null, null, null)
        }

        adjacent.forEach(cell => {
            if (cell) {
                if (cell.style.background === sColor) {
                    // cell.style.background = color
                    // cell.classList.add('painted')
                    paintAdjacentAuto(cell)
                    setPaintX(null)
                    setPaintY(null)
                } else {
                    setPaintX(null)
                    setPaintY(null)
                }
            }
        })
    }

    const selectStart = e => {
        const [co, x, y] = e.target.className.split('-')
        setPaintX(x)
        setPaintY(y)
        setSColor(e.target.style.background)
        setTempGrid(renderGrid)
    }

    return (
        <div className={styles.grid}>
            <form onSubmit={renderInit}>
                <div className={styles.input}>
                    <label>Grid Width:</label>
                    <input
                        type="number"
                        min="1"
                        step='1'
                        required
                        value={gridX}
                        onChange={(e) => setGridX(e.target.value)}
                    />
                    <label>Grid Height:</label>
                    <input
                        type="number"
                        min="1"
                        step='1'
                        required
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
                    onClick={paint}
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
