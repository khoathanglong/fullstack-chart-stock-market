import React from 'react';

export default (props)=>{
	return (
		<form
			onSubmit={props.handleText} onChange={props.handleChange}
		>
			<input type="text" name="textValue" className="input"/><br/>
			<button type="submit">Add</button>
		</form>
	)
}