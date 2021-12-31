/**
 * Copyright (c) 2019 FarmLead Resources Ltd. All rights reserved.
 */

// lodash
var _ = require('lodash')

// The colors this grid allows
var COLORS = [
  'red',
  'blue',
  'green'
]

/**
 * Flood fills the given grid by changing the color of the point at x and y
 * 
 * @param {[][]string} grid Grid on which you should implement the flooding algorithm using the color defined at the x and y coordinates given in the x and y args
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {string} color New color to fill with using the flood algorithm, will be one of the COLORS
 * @returns {[][]string} Grid array with the implemented flood fill algorithm
 */
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
      `${pixelX-1}-${pixelY-1}`, `${pixelX-1}-${pixelY}`, `${pixelX-1}-${pixelY+1}`,
      `${pixelX}-${pixelY-1}`, `${pixelX}-${pixelY+1}`,
      `${pixelX+1}-${pixelY-1}`, `${pixelX+1}-${pixelY}`, `${pixelX+1}-${pixelY+1}`
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

exports.floodFillAt = floodFillAt

/**
 * Generates a (rowsxcolumns) grid where the color of each point in the grid is randomly selected to be red, blue or green
 * 
 * @param {number} rows Number of rows in this grid
 * @param {number} columns Number of columns in this grid
 * @returns {[][]string} Grid array
 */
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

exports.generateRandomGrid = generateRandomGrid
