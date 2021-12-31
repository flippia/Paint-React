import styles from './BeforeGrid.module.css'

const beforeGrid = ({ beforegrid }) => {
    return (
        <div className={styles['before-grid']}>
            <h3>Original:</h3>
            <table >
                <tbody>
                    {beforegrid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    style={{ background: cell }}
                                    className={`td-${rowIndex + 1}-${colIndex + 1}`}
                                >
                                    {rowIndex + 1}, {colIndex + 1}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default beforeGrid;