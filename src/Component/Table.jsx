import React from "react";
import TableLoader from "./TableLoader";

const Table = (props) => {
  const renderHeader = () => {
    return (
      <tr>
        <th>SN</th>
        {props.headers.map(({ title }) => {
          return (
            <>
              <th key={title}>{title}</th>
            </>
          );
        })}
        {props.action ? <th>Actions</th> : null}
      </tr>
    );
  };

  const renderBody = () => {
    return props.data?.map((data, index) => (
      <tr>
        <td className="ps-3" key={index}>
          {index + 1}
        </td>
        {props.headers?.map((header, keys) => {
          if (header?.render) {
            return <td key={keys}> {header.render(data)}</td>;
          } else {
            return <td key={keys + 1}>{data[header.field]}</td>;
          }
        })}
        <td key={index + 1}>
          {props.action?.map((element) => (
            <span style={{color:element.color}}
              onClick={(e) => {
                element?.action(e, data.slug);
              }}
            >
              {element.icon}
            </span>
          ))}
        </td>
      </tr>
    ));
  };

  return (
    <>
      {props.loader ? (
        <TableLoader
          headers={props.headers}
          action={props.action}
          numberOfRows={3}
        />
      ) : (
        <div className="tableDiv">
          <table className="table table-borderless tables" cellPadding='10' >
            <thead>{renderHeader()}</thead>

            {renderBody()}
          </table>
        </div>
      )}
    </>
  );
};

export default Table;
