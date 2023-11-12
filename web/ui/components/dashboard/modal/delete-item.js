const DeleteItemModal = ({type, data, onConfirm, onClose}) => {
    if (type === "class") {
        return (
            <div className="modal space-y-6 w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
                <h1 className="text-mainRed heading-lg">Delete this class?</h1>
                <p className="body-lg">Are you sure you want to delete this class? All quizzes and their responses of this class will be also deleted as well. <br/> THIS ACTION CAN NOT BE REVERSED.</p>
                <p>Class ID: {data.codename}</p>
                <p>Subject: {data.subject}</p>
                <div className="flex gap-4">
      
                    <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200" onClick={() => {
                        onConfirm()
                    }}>
                        Delete
                    </button>
                    <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
          )
    } else {
        return (
            <div className="modal space-y-6 w-full mx-auto rounded-md p-6 dark:bg-darkGrey md:p-8">
                <h1 className="text-mainRed heading-lg">Delete this quiz?</h1>
                <p className="body-lg">Are you sure you want to delete this quiz? This quiz and it&apos;s responses will be deleted. <br/> THIS ACTION CAN NOT BE REVERSED.</p>
                <p>Class ID: {data._class.codename}</p>
                <div className="flex gap-4">
      
                    <button className="flex-1 text-white text-base rounded-full p-2 transition duration-200" onClick={() => {
                        onConfirm()
                    }}>
                        Delete
                    </button>
                    <button className="flex-1 bg-opacity-10 text-base rounded-full p-2 transition duration-200" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
          )
    }
    
  }
  export default DeleteItemModal
