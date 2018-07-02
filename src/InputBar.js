import React from 'react';

const InputBar = (props) => {
  return (
    <div className="col-sm-12">
      <form onSubmit={props.onSubmit} className="form">
        <div className="row">
          <div className="form-group mb-2 mt-3 col-sm-10">
            <input
              className="form-control form-control-lg"
              type="text"
              onChange={props.onChange}
              value={props.value}
              placeholder="Input github username"
            />
          </div>
          <input
            className="btn btn-default btn-lg mb-2 mt-3 col-sm-2" 
            type="submit" 
            value="OK" 
          />
        </div>
      </form>
    </div>
  );
}

export default InputBar;