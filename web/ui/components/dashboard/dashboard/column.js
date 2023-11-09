const Column = ({ data, children }) => {
  // console.log(data)
  return (
    <div className="dashboard-column column shrink-0">
      <h3 className="heading-sm uppercase mb-6">
        <span className="item-status inline-block h-3 w-3 rounded-full"></span>
        {data.name} ({data.items.length})
      </h3>
      <ul className="pb-12 flex flex-col gap-5">
        {children}
      </ul>
    </div>
  )
}
export default Column