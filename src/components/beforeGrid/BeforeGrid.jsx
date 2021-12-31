import styles from './BeforeGrid.module.css'

const beforeGrid = ({ beforegrid,showContent,width }) => {
    return (
        <div className={styles['before-grid']}>
            <h3>Original:</h3>
            <table style={{ width: `${600 / width}%` }}>
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
