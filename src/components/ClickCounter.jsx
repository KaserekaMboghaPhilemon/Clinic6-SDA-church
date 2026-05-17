import React, { useState } from 'react'

const ClickCounter = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="click-counter">
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
    </div>
  )
}

export default ClickCounter
