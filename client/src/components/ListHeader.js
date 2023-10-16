import Button from '@mui/material/Button';

const ListHeader = ({ listName }) => {
    
    const signOut = () => {
        console.log('signout')
    }
    
    return (
      <div className="list-header">
        <h1>{listName}</h1> 
            <div className="button-container">
                <Button variant="contained" className="create">ADD NEW</Button>
                <Button variant="contained" className="signout" onClick={signOut}>SIGN OUT</Button>
            </div> 
      </div>
    );
  }
  
  export default ListHeader;
  