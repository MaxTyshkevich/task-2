import { useEffect, useState, useRef, memo, useCallback } from 'react';


type Mode = 'add' | 'remove';

const useRenderCounter = () => {
  const counter = useRef(0);
  counter.current++;

  return counter.current;
};

const RenderCountLabel = ({
  count,
  label,
}: {
  count: number;
  label: string;
}) => {
  return (
    <div>
      {label} renders: <span style={{ color: 'red' }}>{count}</span>
    </div>
  );
};


const ButtonWithLabel = memo(({
    action,
    onClick,
    btnText,
  }: { 
    onClick: () => void;
    btnText: string;
    action?: Mode;
    }) => {
    const counter = useRenderCounter();

    return (
    <div>
      <button onClick={onClick}>{btnText} {action}</button>
      <RenderCountLabel label="Button" count={counter} />
    </div>
    )
})

const ListItem = memo(({
  item,
  onRemove,
}: {
  item: string;
  onRemove: (item: string) => void;
}) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const onClick = () => {
    if (itemRef?.current) {
      itemRef.current.animate([
      {
        transform: 'scale(1)',
        opacity: 1,
      },
      {
        transform: 'scale(1.2)',
        opacity: 0.6},
      { 
        transform: 'scale(1)',
        opacity: 1
      }],
        {
         duration: 1500 
        }
      )
    }
  };
  return (
    <li onClick={onClick} className="li-item" ref={itemRef}>
      {item}
      <button className="btn-remove" onClick={() => onRemove(item)}>
        x
      </button>
    </li>
  );
});



const List = () => {

  const refIndex = useRef(0)
  const counter = useRenderCounter();
  const [items, setItems] = useState<string[]>([]);
  const [action, setAction] = useState<Mode>('add');

  const handleChangeAction = useCallback(() => {
    setAction((prev) => (prev === 'add' ? 'remove' : 'add'));
  },[]);

  const handlRemoveItems = useCallback(() => {
    setItems((prev) => prev.slice(0, prev.length - 1));
  }, []);

  const handleRemoveItem = useCallback((item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
  },[]);

  const handleAddItem = useCallback(() => {
    refIndex.current += 1;
    setItems((prev) => [...prev, `${refIndex.current}-item`]);
  },[]);

  const handleAddToStart = useCallback(() => {
    refIndex.current += 1;
    setItems((prev) => [`${refIndex.current}-item`, ...prev]);
  },[]);

  useEffect(() => {
   const timerId = setInterval(
      () => (action === 'add' ? handleAddItem() : handlRemoveItems()),
      1000
    );

    return () => clearInterval(timerId); 
  }, [action, handleAddItem, handlRemoveItems]);

  return (
    <ul className="list">
      <RenderCountLabel label="List" count={counter} />
      <br />
    
      <ButtonWithLabel btnText='change mode:' action={action} onClick={handleChangeAction} />
      <br />
      <div className="btn-actions">
         <ButtonWithLabel btnText='Add to start' onClick={handleAddToStart} />
         <ButtonWithLabel btnText='Add to end' onClick={handleAddItem} />
      </div>
      {items.map((item) => (
        <ListItem item={item} key={item} onRemove={handleRemoveItem} />
      ))}
    </ul>
  );
};

function App() {
  return (
    <div>
       <List /> 
    </div>
  );
}

export default App;