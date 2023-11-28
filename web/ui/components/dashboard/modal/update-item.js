import DeleteIcon from "@/assets/icons/thin/delete.svg";
import Image from "next/image";
import { Table, useAsyncList } from "@nextui-org/react";

const UpdateItemModal = ({ type, data, responses, switchToDelete }) => {
  if (type === "class") {
    const load = () => {
      return {
        items: data.quizzes,
      }
    }

    const ahihi = useAsyncList({ load }) // eslint-disable-next-line react-hooks/rules-of-hooks
    console.log(ahihi.items)

    return (
      <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="heading-lg">Class #{data.codename}</h1>
          <button className="h-8 w-8 delete" onClick={() => switchToDelete()}>
            <Image
              src={DeleteIcon}
              alt="vertical ellipsis"
            />
          </button>
        </div>

        <div className="responses">
          <h2>Quizzes:</h2>
          <Table headerLined>
            <Table.Header>
              <Table.Column width={270}>Quiz ID</Table.Column>
              <Table.Column width={100}>Status</Table.Column>
              <Table.Column width={"auto"}>Form</Table.Column>
            </Table.Header>
            {console.log(ahihi.items[0])}
            {ahihi.items.length > 0 ? (
              <Table.Body
                items={ahihi.items}
                loadingState={ahihi.loadingState}
                onLoadMore={ahihi.loadMore}>
                {(item) => (
                  <Table.Row key={item._id}>
                    <Table.Cell >
                      <p className="name">
                        {item._id}
                      </p>
                      <p className="id">
                      {new Date(item.startTime).toLocaleString()}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      {item.status}
                    </Table.Cell>
                    <Table.Cell>{item.formLink}</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            ) : (
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="empty">No quizzes yet</Table.Cell>
                  <Table.Cell className="empty"></Table.Cell>
                  <Table.Cell className="empty"></Table.Cell>
                </Table.Row>
              </Table.Body>
            )}
          </Table>
        </div>
      </div>
    )
  } else {
    const exportResponse = () => {
      const worksheet = XLSX.utils.json_to_sheet(responses);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const payload = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      const downloadUrl = URL.createObjectURL(payload);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${data._id}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    const load = () => {
      return {
        items: responses,
      }
    }

    const ahihi = useAsyncList({ load }) // eslint-disable-next-line react-hooks/rules-of-hooks
    console.log(ahihi.items)

    return (
      <div className="modal w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="heading-lg">Quiz #{data._id.substring(0, 5)}</h1>
          <button className="h-8 w-8 delete" onClick={() => switchToDelete()}>
            <Image
              src={DeleteIcon}
              alt="vertical ellipsis"
            />
          </button>
        </div>
        <div className="stats">
          <p className="body-lg text-mediumGrey">
            Start Time: {new Date(data.startTime).toLocaleString()}
          </p>
          <p className="body-lg text-mediumGrey">
            End Time: {new Date(data.endTime).toLocaleString()}
          </p>
          <p className="body-lg text-mediumGrey">
            Class: {data._class.codename}
          </p>
          <p className="body-lg text-mediumGrey">
            Subject: {data._class.subject}
          </p>
          <p className="body-lg text-mediumGrey">
            Responses: {responses.length} / {data._class.studentCount}
          </p>
          <p className="body-lg text-mediumGrey">
            Interval: {(new Date(data.endTime) - new Date(data.startTime)) / 1000 / 60} mins
          </p>
        </div>
        <div className="responses">
          <h2>Responses:</h2>
          <Table headerLined>
            <Table.Header>
              <Table.Column width={270}>Student</Table.Column>
              <Table.Column width={100}>Status</Table.Column>
              <Table.Column width={"auto"}>IP Address</Table.Column>
            </Table.Header>
            {console.log(ahihi.items[0])}
            {ahihi.items.length > 0 ? (
              <Table.Body
                items={ahihi.items}
                loadingState={ahihi.loadingState}
                onLoadMore={ahihi.loadMore}>
                {(item) => (
                  <Table.Row key={item._id}>
                    <Table.Cell >
                      <p className="name">
                        {item.studentName}
                      </p>
                      <p className="id">
                        {item.studentId}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      {item.isValid ? (
                        <p className="name">
                          Success
                        </p>
                      ) : (
                        <>
                          <p className="name">
                            Fail
                          </p>
                          <p className="id">
                            {item.note}
                          </p>
                        </>
                      )}
                    </Table.Cell>
                    <Table.Cell>{item.ipAddress}</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            ) : (
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="empty">No responses yet</Table.Cell>
                  <Table.Cell className="empty"></Table.Cell>
                  <Table.Cell className="empty"></Table.Cell>
                </Table.Row>
              </Table.Body>
            )}
          </Table>
        </div>

        {data.status === "Finished" ? (
          <button onClick={exportResponse} className="export-button">
            Export
          </button>
        ) : (
          <></>
        )
        }

      </div>
    )
  }
}

export default UpdateItemModal
