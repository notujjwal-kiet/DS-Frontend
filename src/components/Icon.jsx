export default function Icon({ name }) {
  const paths = {
    compass: 'M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z',
    pipeline: 'M4 7h16M4 12h16M4 17h16',
    source: 'M5 4h14v16H5z M8 8h8M8 12h8M8 16h5',
    book: 'M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2V4z M7 4v16',
    map: 'M4 6l6-2 4 2 6-2v14l-6 2-4-2-6 2V6z M10 4v14M14 6v14',
    practice: 'M5 4h14v16H5z M8 8h8M8 12h5M8 16h7',
    search: 'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.3-4.3',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    check: 'M5 12l4 4L19 6',
    link: 'M10 13a5 5 0 007.5.5l1-1a5 5 0 00-7-7l-.6.6 M14 11a5 5 0 00-7.5-.5l-1 1a5 5 0 007 7l.6-.6',
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.compass} /></svg>;
}
