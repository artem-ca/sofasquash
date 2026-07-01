'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDate } from '@/utils/date'

export default function BlogClient({ posts, topics }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('all')

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return posts.filter((post) => {
      const matchesSearch =
        query === '' ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query)

      const matchesTopic =
        selectedTopic === 'all' || (post.topics || []).includes(selectedTopic)

      return matchesSearch && matchesTopic
    })
  }, [posts, searchTerm, selectedTopic])

  return (
    <>
      <section className='max-w-4xl mx-auto w-full mb-10 space-y-4'>
        {/* Поиск на всю ширину */}
        <div className='relative w-full'>
          <input
            type='text'
            placeholder='Поиск по статьям...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label='Поиск по статьям'
            className='w-full px-3 py-2.5 rounded-md border text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-all bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100'
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer'
            >
              ✕
            </button>
          )}
        </div>

        {/* Темы блога под поиском, отцентрированные */}
        <div className='flex items-center justify-center gap-1 border-b md:border-none border-slate-100 dark:border-neutral-900 pb-2 md:pb-0 overflow-x-auto scrollbar-none'>
          {['all', ...topics].map((topic) => {
            const isActive = selectedTopic === topic
            return (
              <button
                key={topic}
                type='button'
                onClick={() => setSelectedTopic(topic)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {topic === 'all' ? 'Все темы' : topic}
              </button>
            )
          })}
        </div>
      </section>

      {filteredPosts.length > 0 ? (
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full mb-16'>
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className='p-6 rounded-2xl border transition-all duration-300 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/10 hover:border-amber-500/20 dark:hover:border-amber-500/30 flex flex-col justify-between h-full group hover:shadow-lg dark:hover:shadow-amber-500/5 relative bling'
            >
              <div>
                <span className='text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500'>
                  {formatDate(post.date)}
                </span>
                <h2 className='text-xl font-bold mt-2 mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'>
                  {post.title}
                </h2>
                <p className='text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3'>
                  {post.summary}
                </p>

                {post.topics && post.topics.length > 0 && (
                  <div className='flex flex-wrap gap-1.5 mt-4'>
                    {post.topics.map((topic) => (
                      <span
                        key={topic}
                        className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className='mt-6 text-xs font-bold text-amber-600 dark:text-amber-500 group-hover:underline inline-flex items-center gap-1.5 relative z-10'>
                Читать статью
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2.5'
                  stroke='currentColor'
                  className='w-3.5 h-3.5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 text-sm text-slate-500'>
          По вашему запросу статьи не найдены. Попробуйте изменить тему или
          поисковую фразу.
        </div>
      )}
    </>
  )
}
