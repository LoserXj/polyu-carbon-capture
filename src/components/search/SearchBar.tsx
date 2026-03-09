import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import type { BuildingProperties } from '../../types'
import './SearchBar.css'

interface SearchBarProps {
  buildings: BuildingProperties[]
  onSelect: (building: BuildingProperties) => void
}

export default function SearchBar({ buildings, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return buildings.filter(b =>
      b.name_zh?.toLowerCase().includes(q) ||
      b.name_en?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [query, buildings])

  const handleSelect = useCallback((building: BuildingProperties) => {
    onSelect(building)
    setQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }, [onSelect])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelect(results[activeIndex])
      } else if (results.length > 0) {
        handleSelect(results[0])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }
  }, [activeIndex, results, handleSelect])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="搜索建筑（中/英文）..."
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => { setQuery(''); setIsOpen(false) }}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="search-dropdown">
          {results.map((b, i) => (
            <li
              key={b.id}
              className={`search-item ${i === activeIndex ? 'search-item--active' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => handleSelect(b)}
            >
              <span className="search-item-name">{b.name_zh || b.id}</span>
              {b.name_en && (
                <span className="search-item-en">{b.name_en}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="search-dropdown search-empty">
          无匹配结果
        </div>
      )}
    </div>
  )
}
