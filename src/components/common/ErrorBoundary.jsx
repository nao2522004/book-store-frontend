import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-20 bg-[#FAF5EC] text-center">
          <p className="text-4xl mb-4 text-[#8B6508]">❖</p>
          <h1
            className="text-lg font-bold uppercase tracking-wider text-[#140E0A] mb-2"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Đã xảy ra lỗi
          </h1>
          <p className="text-sm text-stone-500 font-serif italic mb-8 max-w-md">
            Trang này gặp sự cố không mong muốn. Bạn có thể thử tải lại hoặc quay về trang chủ.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 border-2 border-[#2C2114] text-xs font-bold uppercase tracking-wider text-[#2C2114] hover:bg-[#2C2114] hover:text-[#FAF5EC] transition-colors rounded-[1px]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Thử lại
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 bg-[#8B6508] text-[#FAF5EC] text-xs font-bold uppercase tracking-wider hover:bg-[#735220] transition-colors rounded-[1px]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
