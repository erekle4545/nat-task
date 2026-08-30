function Filters({ filter, sort, onFilterChange, onSortChange }) {
  return (
    <div className="filters">
      <div className="buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => onFilterChange('active')}
        >
          Active
        </button>
        <button
          className={filter === 'done' ? 'active' : ''}
          onClick={() => onFilterChange('done')}
        >
          Done
        </button>
      </div>

      <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
        <option value="new">New first</option>
        <option value="old">Old first</option>
        <option value="title">By name</option>
      </select>
    </div>
  )
}

export default Filters
