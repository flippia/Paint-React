import styles from './BeforeGrid.module.css'

const beforeGrid = ({ beforegrid,showContent,width }) => {
    return (
        <div className={styles['before-grid']}>
            <h3>Before:</h3>
            <table style={{ width: `${2.2 * width}rem` }}>
                <tbody>
                    {beforegrid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    style={{ background: cell }}
                                    className={`td-${rowIndex + 1}-${colIndex + 1}`}
                                >
                                    {showContent ? `${rowIndex + 1}, ${colIndex + 1}` : ''}
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
