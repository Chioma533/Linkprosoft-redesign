import React from 'react';
import {
  FiBell,
  FiBookmark,
  FiChevronDown,
  FiEdit3,
  FiImage,
  FiMenu,
  FiMessageCircle,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiThumbsUp,
  FiUser,
  FiUsers,
  FiVideo,
} from 'react-icons/fi';
import DashboardNavbar from '../components/layout/DashboardNavbar';

const profileMenu = [
  { label: 'Saved items', icon: FiBookmark },
  { label: 'Groups', icon: FiUsers },
  { label: 'Newsletter', icon: FiMessageSquare },
];

const messages = [
  { name: 'Marvelous Samuel', avatar: 'MS' },
  { name: 'Marvelous Samuel', avatar: 'MS' },
  { name: 'Marvelous Samuel', avatar: 'MS' },
  { name: 'Marvelous Samuel', avatar: 'MS' },
];

const feedPosts = [
  {
    id: 1,
    author: 'Elvis Chioma M',
    role: 'Electrician',
    time: '2hr ago',
    content:
      'One of the most common issues I encounter is overloaded extension cords. Plugging too many appliances into a single socket can lead to overheating and even electrical fires. A quick safety inspection today can save you from costly repairs tomorrow. Stay safe and never ignore the warning signs.',
    likes: 887,
    comments: 887,
    shares: 887,
    following: true,
  },
  {
    id: 2,
    author: 'Elvis Chioma M',
    role: 'Electrician',
    time: '2hr ago',
    content: 'Project completed! + Custom TV console and shelving unit installed with a clean, modern finish.',
    likes: 0,
    comments: 0,
    shares: 0,
    following: false,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    ],
  },
];

const avatarStyle = 'flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe5e8] bg-gradient-to-br from-[#254d78] via-[#7a9db8] to-[#dce5eb] text-[10px] font-bold text-white';

const DesktopCommunityPage = () => (
  <div className="min-h-screen bg-[#f3f3f3] text-[#141414]">
    <DashboardNavbar title="Community" isOpen={false} onMenuClick={() => {}} />

    <main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)_300px]">
        <aside className="rounded-[30px]  bg-[#f8f8f8] p-4">
          <div className="relative overflow-hidden rounded-[28px]  bg-[#f5f5f5] p-3">
            <div className="relative h-28 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#f7d7d8] via-[#f0f2f4] to-[#f3f3f3]">
              <div className="absolute -left-10 top-4 h-40 w-40 rounded-full bg-[#f3c0c6] opacity-80" />
              <div className="absolute -right-8 top-1 h-32 w-32 rounded-full bg-[#6ec7c5] opacity-90" />
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-[#f3f3f3] bg-[#4aa0b8]" />
            </div>

            <div className="relative -mt-7 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-[#f7f7f7] bg-gradient-to-br from-[#255e89] via-[#5aa3be] to-[#dce8ef] text-lg font-bold text-white">
                S
              </div>
            </div>

            <div className="pt-3 text-center">
              <h2 className="text-[1.1rem] font-semibold tracking-[-0.03em] text-[#141414]">Samuel owoniyi</h2>
              <p className="text-sm text-[#5a5a5a]">A professional plumber with vast years of experience Lagos, Nigeria</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#e8e8e8] py-4 text-sm text-[#4c4c4c]">
            <div className="rounded-2xl bg-[#f2f3f3] px-3 py-2 text-center">
              <p className="text-[0.7rem] uppercase tracking-wide text-[#6b6b6b]">Profile viewers</p>
              <p className="mt-2 text-xl font-semibold text-[#1b1b1b]">87</p>
            </div>
            <div className="rounded-2xl bg-[#f2f3f3] px-3 py-2 text-center">
              <p className="text-[0.7rem] uppercase tracking-wide text-[#6b6b6b]">Post impression</p>
              <p className="mt-2 text-xl font-semibold text-[#1b1b1b]">87</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {profileMenu.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-[#f4f4f4] px-3 py-3 text-left transition-colors hover:border-[#e2e2e2] hover:bg-[#f0f0f0]"
              >
                <span className="flex items-center gap-3 text-[0.98rem] text-[#242424]">
                  <Icon className="h-4 w-4 text-[#1d1d1d]" />
                  {label}
                </span>
                {label === 'Saved items' || label === 'Groups' ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0d7ac2] text-[0.6rem] font-bold text-white">1</span>
                ) : null}
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[26px]  bg-[#f8f8f8] p-4">
            <div className="flex items-center gap-3 rounded-full  bg-[#f2f2f2] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1f4d75] via-[#7aa6bd] to-[#dfeaf0] text-white">
                <FiUser className="h-5 w-5" />
              </div>
              <div className="flex-1 text-[#7b7b7b]">Create a post...</div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#ebebeb] pt-3 text-sm text-[#4d4d4d]">
              <div className="flex flex-1 items-center justify-center gap-2 rounded-full px-2 py-2 hover:bg-[#f0f0f0]">
                <FiVideo className="h-4 w-4 text-[#5e5e5e]" />
                <span>Video</span>
              </div>
              <div className="flex flex-1 items-center justify-center gap-2 rounded-full px-2 py-2 hover:bg-[#f0f0f0]">
                <FiImage className="h-4 w-4 text-[#5e5e5e]" />
                <span>Photos</span>
              </div>
              <div className="flex flex-1 items-center justify-center gap-2 rounded-full px-2 py-2 hover:bg-[#f0f0f0]">
                <FiEdit3 className="h-4 w-4 text-[#5e5e5e]" />
                <span>Write Article</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end text-sm text-[#666]">
            <span>Sort by:</span>
            <span className="ml-2 flex items-center gap-1 font-medium text-[#1c1c1c]">
              The newest <FiChevronDown className="h-4 w-4" />
            </span>
          </div>

          {feedPosts.map((post) => (
            <article key={post.id} className="rounded-[26px]  bg-[#f8f8f8] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={avatarStyle}>E</div>
                  <div>
                    <div className="flex items-center gap-2 text-[#1f1f1f]">
                      <span className="text-base font-semibold">{post.author}</span>
                      <span className="text-sm text-[#7a7a7a]">•</span>
                      <span className="text-sm text-[#7a7a7a]">{post.time}</span>
                    </div>
                    <div className="text-sm text-[#676767]">{post.role}</div>
                  </div>
                </div>

                <button className="flex items-center gap-2 rounded-full border border-[#dfe9f2] bg-[#edf6ff] px-3 py-1.5 text-sm font-medium text-[#0c76c9]">
                  <FiPlus className="h-4 w-4" />
                  {post.following ? 'Following' : 'Follow'}
                </button>
              </div>

              <p className="mt-4 whitespace-pre-line text-[1.02rem] leading-8 text-[#2a2a2a]">{post.content}</p>

              {post.images && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {post.images.map((image, index) => (
                    <div
                      key={`${post.id}-${index}`}
                      className={`overflow-hidden rounded-[18px] border border-[#e5e5e5] ${index === 0 ? 'col-span-2' : ''}`}
                    >
                      <img src={image} alt="Project showcase" className="h-52 w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center gap-6 text-sm text-[#5f5f5f]">
                <span className="flex items-center gap-2">
                  <FiThumbsUp className="h-4 w-4" /> {post.likes || 887}
                </span>
                <span className="flex items-center gap-2">
                  <FiMessageCircle className="h-4 w-4" /> {post.comments || 887}
                </span>
                <span className="flex items-center gap-2">
                  <FiMessageSquare className="h-4 w-4" /> {post.shares || 887}
                </span>
              </div>
            </article>
          ))}
        </section>

        <aside className="rounded-[30px]  bg-[#f8f8f8] p-4">
          <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4">
            <h3 className="text-[1.8rem] font-medium tracking-[-0.04em] text-[#1d1d1d]">Messages</h3>
            <button className="text-2xl font-light text-[#5d5d5d]">×</button>
          </div>

          <div className="mt-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.name}-${index}`}
                className="flex items-center justify-between gap-3 border-b border-[#ececec] py-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#d1d1d1] via-[#7aa0bb] to-[#3f6d8d] text-[10px] font-bold text-white">
                      {message.avatar}
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#f8f8f8] bg-[#2dc36f]" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-[#1a1a1a]">{message.name}</p>
                    <p className="text-xs text-[#6d6d6d]">How are you Choma, Nice to connect with you.</p>
                  </div>
                </div>
                <div className="text-[10px] text-[#808080]">{index === 0 ? 'now' : '1m'}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  </div>
);

const MobileCommunityPage = () => (
  <div className="min-h-screen bg-[#f3f3f3] text-[#191919]">
    <header className="border-b border-[#e7e7e7] bg-[#f3f3f3]">
      <div className="mx-auto flex max-w-[420px] items-center justify-between px-4 py-3">
        <button className="flex h-8 w-8 items-center justify-center text-[#1d1d1d]" aria-label="Open menu">
          <FiMenu className="h-5 w-5" />
        </button>

        <h1 className="text-[1.1rem] font-medium text-[#1d1d1d]">Community</h1>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8d8d8] bg-gradient-to-br from-[#dfeaf0] via-[#90adbf] to-[#3d7ca3] text-[10px] font-bold text-white">
          S
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-[420px] px-3 pb-6 pt-4">
      <div className="rounded-[22px]  bg-[#f8f8f8] p-3">
        <div className="flex items-center gap-3 rounded-full  bg-[#f2f2f2] px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1f4d75] via-[#7aa6bd] to-[#dfeaf0] text-white">
            <FiUser className="h-4 w-4" />
          </div>
          <div className="flex-1 text-sm text-[#7a7a7a]">Create a post...</div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e9e9e9] pt-3 text-[11px] font-medium text-[#4f4f4f]">
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-1 py-1.5">
            <FiVideo className="h-3.5 w-3.5" />
            <span>Video</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-1 py-1.5">
            <FiImage className="h-3.5 w-3.5" />
            <span>Photos</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-1 py-1.5">
            <FiEdit3 className="h-3.5 w-3.5" />
            <span>Write Article</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end px-1 text-[12px] text-[#5e5e5e]">
        <span>Sort by :</span>
        <span className="ml-2 flex items-center gap-1 font-medium text-[#1b1b1b]">
          The newest <FiChevronDown className="h-3.5 w-3.5" />
        </span>
      </div>

      {feedPosts.map((post) => (
        <article key={post.id} className="mt-4 rounded-[22px]  bg-[#f8f8f8] p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#254d78] via-[#7a9db8] to-[#dce5eb] text-[10px] font-bold text-white">
                E
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#1b1b1b]">
                  <span className="font-semibold">{post.author}</span>
                  <span className="text-[#7b7b7b]">•</span>
                  <span className="text-[#7b7b7b]">{post.time}</span>
                </div>
                <div className="text-[11px] text-[#676767]">{post.role}</div>
              </div>
            </div>

            <button className="flex items-center gap-1 rounded-full border border-[#dfe9f2] bg-[#edf6ff] px-2.5 py-1 text-[12px] font-medium text-[#0c76c9]">
              <FiPlus className="h-3.5 w-3.5" />
              {post.following ? 'Following' : 'Follow'}
            </button>
          </div>

          <p className="mt-3 text-[13px] leading-6 text-[#272727]">{post.content}</p>

          {post.images && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {post.images.map((image, index) => (
                <div
                  key={`${post.id}-${index}`}
                  className={`overflow-hidden rounded-[16px] border border-[#e5e5e5] ${index === 0 ? 'col-span-2' : ''}`}
                >
                  <img src={image} alt="Project showcase" className="h-32 w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center gap-4 text-[11px] text-[#5d5d5d]">
            <span className="flex items-center gap-1.5">
              <FiThumbsUp className="h-3.5 w-3.5" />
              {post.likes || 887}
            </span>
            <span className="flex items-center gap-1.5">
              <FiMessageCircle className="h-3.5 w-3.5" />
              {post.comments || 887}
            </span>
            <span className="flex items-center gap-1.5">
              <FiMessageSquare className="h-3.5 w-3.5" />
              {post.shares || 887}
            </span>
          </div>
        </article>
      ))}
    </main>
  </div>
);

const CommunityPage = () => (
  <>
    <div className="hidden lg:block">
      <DesktopCommunityPage />
    </div>
    <div className="block lg:hidden">
      <MobileCommunityPage />
    </div>
  </>
);

export default CommunityPage;
