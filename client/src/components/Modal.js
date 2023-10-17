const Modal = () => {
    const mode = 'edit'
    
    const handleChange = () => {
        console.log('changing')
    }

    return (
      <div className="overlay">
        <div className="modal">
          <div className="form-title-container">
            <h3>Let's {mode} your task. </h3>
            <button>X</button>
          </div>
        
          <form>
            <input 
              required
              maxLength={250} 
              placeholder="Your task goes here."
              name="title"
              value={""}
              onChange={handleChange}
            />
            <br/>
            <input
            />
            <br/>
            <input type="submit"/>
          </form>

        </div>
      </div>
    );
  }
  
  export default Modal;
  