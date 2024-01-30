export function NestedOrdererdList({
  items,
  level = 0,
  parentNumber = "",
}: any) {
  if (!items || items.length === 0) {
    return null;
  }

  const isTopLevel = level === 0;

  return (
    <ol style={{ paddingLeft: `${level * 20}px` }} className="space-y-1 pt-2">
      {items.map((item: any, index: number) => (
        <li key={index}>
          {isTopLevel ? (
            <span>{index + 1}. </span>
          ) : (
            <span>
              {parentNumber}
              {index + 1}.{" "}
            </span>
          )}
          {item.content}
          <NestedOrdererdList
            items={item.items}
            level={level + 1}
            parentNumber={`${parentNumber}${index + 1}.`}
          />
        </li>
      ))}
    </ol>
  );
}
export function NestedUnorderedList({ items, level = 0 }: any) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul style={{ paddingLeft: `${level * 20}px` }} className="space-y-1 pt-2">
      {items.map((item: any, index: number) => (
        <li key={index}>
          {`• ${item.content}`}
          <NestedUnorderedList items={item.items} level={level + 1} />
        </li>
      ))}
    </ul>
  );
}
