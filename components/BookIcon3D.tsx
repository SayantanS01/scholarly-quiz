export function BookIcon3D() {
  return (
    <div className="book-3d-wrapper">
      <div className="book-3d">
        <div className="book-3d-spine"></div>
        <div className="book-3d-cover-back"></div>
        <div className="book-3d-page"></div>
        <div className="book-3d-page"></div>
        <div className="book-3d-page"></div>
        <div className="book-3d-cover-front flex items-center justify-center">
          <span className="text-[8px] font-black text-primary-foreground transform -rotate-90 origin-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            QUIZ
          </span>
        </div>
      </div>
    </div>
  );
}
