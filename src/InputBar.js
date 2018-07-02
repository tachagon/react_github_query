import React from 'react';

const InputBar = (props) => {
  return (
    <div className="InputBar">
      <form onSubmit={props.onSubmit}>
        <input
          type="text"
          onChange={props.onChange}
          value={props.value}
          placeholder="Input github username"
        />
        <input type="submit" value="OK" />
      </form>
    </div>
  );
}

export default InputBar;