import React, { useState, useEffect, ChangeEvent } from 'react';
import styles from './search.component.module.css';
import { FaSearch } from 'react-icons/fa';

interface SearchResult {
  id: number;
  title: string;
  // more properties as needed
}

const SearchField: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const dummyKeywords: string[] = ['apple', 'banana', 'orange', 'grape', 'watermelon', 'pineapple', 'guava'];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    // Fetch search results from the API
    try {
      const response = await fetch(`YOUR_API_ENDPOINT?q=${query}`);
      const data = await response.json();
      setSearchResults(data.results); // Assuming the API returns an array of results
    } catch (error) {
      console.error('Error fetching search results:', error);
    }

    // Filter suggestions based on the input query
    const filteredSuggestions = dummyKeywords.filter((keyword) =>
      keyword.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSelectSuggestion = (selectedSuggestion: string) => {
    setSearchQuery(selectedSuggestion);
    setSuggestions([]);
  };

  useEffect(() => {
    // Fetch search results whenever searchQuery changes
    handleSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className={styles.search_container}>
      <div className={styles.search_input_container}>
        <div className={styles.powered_by}>Powered by Prime Search</div>
        <div className={styles.search_icon}>
          <FaSearch />
        </div>
        <input
          type="text"
          className={(suggestions.length > 0 ? styles.search_input_suggestion_is_not_empty : styles.search_input_suggestion_is_empty)}
          placeholder=""
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        />
      </div>

      {/* Display suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className={styles.suggestions_dropdown}>
          <br /> <br />
          <hr />
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              className={styles.suggestion_item}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Display search results */}
      <div className={styles.search_results}>
        {searchResults.map((result) => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
    </div>
  );
};

export default SearchField;
