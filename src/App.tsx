
import { useEffect, useMemo, useState } from 'react';
import './App.css'
import { AnimatePresence, motion } from 'framer-motion';
import { nanoid } from 'nanoid';

const getRandomIndexFromArray = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumberFromTo = (from: number, to: number) =>
  Math.round(Math.random() * (to - from)) + from

const size = 100;
type RadiusLocation = 'borderTopRightRadius' | 'borderBottomRightRadius' | 'borderTopLeftRadius' | 'borderBottomLeftRadius'
const colors = ['#F20505', '#D90416', "#F2B705", "#F2CB05", "#022859", "#1E6FD9", "#028C68", "#02A486", 'transparent', 'transparent', 'transparent'];
const radiusLocationArray: RadiusLocation[] = ['borderBottomRightRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius']

const stripesArray = ['0', '45', '90', -45];

const makeStripes = () => {
  const color1 = getRandomColor();
  const color2 = '#ECE4DB';
  const orientation = getRandomIndexFromArray(stripesArray)
  return {
    background: `repeating-linear-gradient(${orientation}deg, ${color1},
      ${color1} 10px,
      ${color2} 10px,
      ${color2} 20px
    )`
  }
}

const getRandomColor = () => getRandomIndexFromArray([...colors])
const getBackground = () => {
  const randomNumber = getRandomNumberFromTo(0, 24)
  if (randomNumber > 1) {
    return { background: getRandomColor() };
  }
  return makeStripes();
}

const getUniqueRadiusLocations = (numberOfCorners: number) => {
  let locations = [...radiusLocationArray];

  while (locations.length > numberOfCorners) {
    const indexToRemove = getRandomNumberFromTo(0, locations.length);
    locations = locations.slice(0, indexToRemove).concat(locations.slice(indexToRemove + 1))
  }
  return locations;
}

const getRandomBorderRadiusProps = () => {
  const numberOfCorners = getRandomNumberFromTo(0, 4);
  const locations = getUniqueRadiusLocations(numberOfCorners);
  const borderRadiusProps: { [key: string]: string } = {};
  locations.forEach((l) => {
    borderRadiusProps[l] = '100%'
  });
  return borderRadiusProps;
}

const GenerateBauhausTileProps = () => {
  const props: React.CSSProperties = {
    height: size,
    width: size,
    position: 'relative',
    ...getBackground(),
    ...getRandomBorderRadiusProps()
  }

  return {
    ...props,
  };
}

const BauhausTile = () => {
  const props = useMemo(() => GenerateBauhausTileProps(), [])
  const dot = getRandomNumberFromTo(0, 16) < 1 ? 'dot' : undefined
  const rotateOrientation = useMemo(() => getRandomNumberFromTo(0, 1) === 0 ? 'rotateY' : 'rotateX', []);
  return <motion.div initial={{ [rotateOrientation]: 90, }}
    animate={{ [rotateOrientation]: 180, }}
    transition={{ duration: 0.5 }}
    exit={{ [rotateOrientation]: 270, }} style={{
      background: '##ECE4DB', height: size,
      width: size,
      position: 'absolute',
      top: 0,
      left: 0,
    }}
  ><div className={dot} style={props} /></motion.div>
}

const FlipCard = () => {
  const [flipped, setFlipped] = useState(false);
  const side1Id = useMemo(() => nanoid(12), []);
  const side2Id = useMemo(() => nanoid(12), [])
  const side1 = useMemo(() => <BauhausTile key={side1Id} />, [flipped]);
  const side2 = useMemo(() => <BauhausTile key={side2Id} />, [!flipped]);
  useEffect(() => {
    const delay = getRandomNumberFromTo(5000, 60000);
    const timer = setTimeout(() => {
      setFlipped(!flipped);
    }, delay);
    return () => clearTimeout(timer);
  }, [flipped]);

  return <div style={{ position: 'relative', width: size, height: size, perspective: size * 4, perspectiveOrigin: 'center' }}><AnimatePresence mode='wait'>{flipped ? side1 : side2}</AnimatePresence></div>
}

function App() {
  const width = Math.floor((window.innerWidth - size) / size);
  const height = Math.floor((window.innerHeight - size) / size);

  const TwoDArray = useMemo(() => new Array(height).fill(new Array(width).fill(null).map(_ => nanoid(12))), []);

  return <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div>{TwoDArray.map((inner) => <div style={{ display: 'flex' }}>{inner.map((id: string) => <FlipCard key={id} />)}</div>)}</div></div>
}

export default App
