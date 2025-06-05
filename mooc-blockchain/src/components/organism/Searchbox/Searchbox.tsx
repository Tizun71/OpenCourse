import CourseService from "@/services/Backend-api/course-service";
import React, { useState, useRef, useEffect } from "react";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";

const SearchBox = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim() !== "") {
      router.push(`/course?search=${encodeURIComponent(query.trim())}`);
      setShowPopup(false);
    }
  };

  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      if (value.trim() === "") {
        setResults([]);
        setShowPopup(false);
        return;
      }

      setLoading(true);
      setShowPopup(true);

      try {
        const response = await CourseService.listAllCourses(value);
        const data = response.data;

        if (data && data.courses) {
          setResults(data.courses);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500)
  ).current;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="search-container" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="search-input"
      />

      {showPopup && (
        <div className="popup-results">
          {loading ? (
            <p>Loading...</p>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="course-card">
                <h3 className="font-bold">{result.courseName}</h3>
                <p className="text-xs">{result.instructorName}</p>
              </div>
            ))
          ) : (
            <p>Không có khóa học nào</p>
          )}
        </div>
      )}

      <style jsx>{`
        .search-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .popup-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: #fff;
          border: 1px solid #ddd;
          border-top: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10;
          max-height: 300px;
          overflow-y: auto;
          padding: 10px;
          border-radius: 0 0 8px 8px;
        }

        .course-card {
          padding: 10px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }

        .course-card:hover {
          background-color: #f5f5f5;
        }

        h3 {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }

        p {
          margin: 4px 0 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default SearchBox;
