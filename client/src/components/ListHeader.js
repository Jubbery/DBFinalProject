import Button from "@mui/material/Button";

const ListHeader = ({ listName }) => {
  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <div className="button-container">
        <Button variant="contained" className="create">
          ADD NEW
        </Button>
      </div>
    </div>
  );
};

export default ListHeader;
