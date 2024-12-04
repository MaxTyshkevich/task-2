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

const AddToEndButton =  memo(({ onClick }: { onClick: () => void }) => {
  const counter = useRenderCounter();
  return (
    <div className="button">
      <button onClick={onClick}>Add to end</button>
      <RenderCountLabel label="Button" count={counter} />
    </div>
  );
});

const AddToStartButton = memo(({ onClick }: { onClick: () => void }) => {
  const counter = useRenderCounter();
  return (
    <div>
      <button onClick={onClick}>Add to start</button>
      <RenderCountLabel label="Button" count={counter} />
    </div>
  );
});

const ChangeModeButton = memo(({
  action,
  onClick,
}: {
  action: Mode;
  onClick: () => void;
}) => {
  const counter = useRenderCounter();
  return (
    <div>
      <button onClick={onClick}>change mode: {action}</button>
      <RenderCountLabel label="Button" count={counter} />
    </div>
  );
});

const ListItem = memo(({
  item,
  onRemove,
}: {
  item: string;
  onRemove: (item: string) => void;
}) => {
  const onClick = () => {};
  return (
    <li onClick={onClick} className="li-item">
      {item}
      <button className="btn-remove" onClick={() => onRemove(item)}>
        x
      </button>
    </li>
  );
});

let index = 0;

const List = () => {

  const refIndex = useRef(0)
  const counter = useRenderCounter();
  const [items, setItems] = useState<string[]>([]);
  const [action, setAction] = useState<Mode>('add');

  const handleChangeAction = useCallback(() => {
    setAction((prev) => (prev === 'add' ? 'remove' : 'add'));
  },[]);

  const handlRemoveItems = () => {
    setItems((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRemoveItem = useCallback((item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
  },[]);

  const handleAddItem = useCallback(() => {
    index++;
    setItems((prev) => [...prev, `${index}-item`]);
  },[]);

  const handleAddToStart = useCallback(() => {
    index++;
    setItems((prev) => [`${index}-item`, ...prev]);
  },[]);

  useEffect(() => {
   const timerId = setInterval(
      () => (action === 'add' ? handleAddItem() : handlRemoveItems()),
      1000
    );

    return () => clearInterval(timerId); 
  }, [action]);

  return (
    <ul className="list">
      <RenderCountLabel label="List" count={counter} />
      <br />
      <ChangeModeButton action={action} onClick={handleChangeAction} />
      <br />
      <div className="btn-actions">
        <AddToStartButton onClick={handleAddToStart} />
        <AddToEndButton onClick={handleAddItem} />
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