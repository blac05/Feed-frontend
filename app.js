const API_BASE = localStorage.getItem("feed_api_base") || "http://localhost:8080";

const state = {
  token: localStorage.getItem("feed_token") || "",
  posts: [],
  pages: [],
  events: [],
  notifications: [],
  topic: "All",
  me: null,
};

const $ = (selector) => document.querySelector(selector);

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function compact(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value || 0);
}

function verifiedBadge(verified) {
  return verified ? '<span class="badge" title="Verified source">V</span>' : "";
}

function setUser(user) {
  if (!user) return;
  state.me = user;
  const avatar = user.avatarInitials || "FU";

  $("#miniName").textContent = user.name;
  $("#miniHandle").textContent = `@${user.handle}`;
  $("#profileName").textContent = user.name;
  $("#profileBio").textContent = user.bio || "";
  $("#miniAvatar").textContent = avatar;
  $("#composerAvatar").textContent = avatar;
  $("#profileAvatar").textContent = avatar;
  $("#nameInput").value = user.name || "";
  $("#avatarInput").value = avatar;
  $("#bioInput").value = user.bio || "";
  $("#wallpaperInput").value = user.wallpaperUrl || "";
  $(".profile-cover").style.backgroundImage = user.wallpaperUrl ? `url("${user.wallpaperUrl}")` : "";
}

function renderStories() {
  const sources = [...state.pages, ...state.posts.map((post) => post.author)];
  const seen = new Set();
  $("#storyRail").innerHTML = sources
    .filter((source) => {
      const key = source.handle || source.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 10)
    .map(
      (source) => `
        <button class="story-card" data-search="${source.handle}" type="button">
          <div class="avatar">${source.avatarInitials}</div>
          <span>${source.name}</span>
        </button>
      `,
    )
    .join("");
}

function renderPosts() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const posts = state.posts.filter((post) => {
    const matchesTopic = state.topic === "All" || post.area === state.topic;
    const matchesQuery = [post.author.name, post.author.handle, post.area, post.body].join(" ").toLowerCase().includes(query);
    return matchesTopic && matchesQuery;
  });

  $("#postList").innerHTML =
    posts
      .map(
        (post) => `
          <article class="post-card" data-id="${post.id}">
            <div class="post-head">
              <div class="avatar">${post.author.avatarInitials}</div>
              <div class="author">
                <strong>${post.author.name}</strong> ${verifiedBadge(post.author.verified)}
                <div class="meta">@${post.author.handle} - ${post.area} - ${new Date(post.createdAt).toLocaleString()}</div>
              </div>
              <button class="secondary-action compact" data-action="follow-user" type="button">Follow</button>
            </div>
            <p class="post-body">${post.body}</p>
            ${post.imageUrl ? `<img class="post-media" src="${post.imageUrl}" alt="Post media" />` : ""}
            <div class="stats">
              ${(post.stats || []).map((stat) => `<div><strong>${stat.value}</strong><span class="meta">${stat.label}</span></div>`).join("")}
            </div>
            <div class="actions">
              <button class="post-action" data-action="like" type="button">Like ${compact(post.likes)}</button>
              <button class="post-action" data-action="comment" type="button">Comment ${compact(post.comments?.length)}</button>
              <button class="post-action" data-action="repost" type="button">Repost ${compact(post.reposts)}</button>
              <button class="post-action" data-action="share" type="button">Share ${compact(post.shares)}</button>
            </div>
            ${
              post.commentsRestricted
                ? '<p class="meta">Comments are restricted by the content owner.</p>'
                : '<div class="comment-box"><input placeholder="Add a comment..." /><button class="secondary-action compact" data-action="reply" type="button">Reply</button></div>'
            }
          </article>
        `,
      )
      .join("") || '<article class="post-card">No posts found.</article>';
}

function renderPages() {
  $("#pageList").innerHTML = state.pages
    .map(
      (page) => `
        <article class="directory-card page-row">
          <div class="avatar">${page.avatarInitials}</div>
          <div class="author">
            <strong>${page.name}</strong> ${verifiedBadge(page.verified)}
            <div class="meta">@${page.handle} - ${page.type} - ${compact(page.followers)} followers</div>
            <p>${page.description}</p>
            <button class="secondary-action compact" data-action="follow-page" data-page-id="${page.id}" type="button">Follow page</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderEvents() {
  $("#eventList").innerHTML = state.events
    .map(
      (event) => `
        <article class="event-card">
          <span class="event-pill">${event.dateLabel}</span>
          <div>
            <strong>${event.title}</strong>
            <div class="meta">${event.organizer} - ${event.area}</div>
          </div>
          <p>${event.description}</p>
          <div>
            <button class="primary-action compact" data-action="event-update" data-event-id="${event.id}" type="button">Get updates</button>
            <button class="secondary-action compact" data-action="ticket" data-event-id="${event.id}" type="button">${event.ticketStatus}</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderNotifications() {
  const unread = state.notifications.filter((item) => !item.read).length;
  $("#notificationCount").textContent = unread;
  $("#notificationList").innerHTML =
    state.notifications
      .map(
        (item) => `
          <div class="notification-row">
            <div class="avatar">F</div>
            <div>
              <strong>${item.message}</strong>
              <p class="meta">${new Date(item.createdAt).toLocaleString()}</p>
            </div>
          </div>
        `,
      )
      .join("") || '<div class="notification-row">No notifications yet.</div>';
}

function renderSuggested() {
  $("#suggestedList").innerHTML = state.pages
    .slice(0, 4)
    .map(
      (page) => `
        <div class="suggested-card">
          <div class="avatar">${page.avatarInitials}</div>
          <div>
            <strong>${page.name}</strong>
            <div class="meta">@${page.handle}</div>
          </div>
          <button class="secondary-action compact" data-action="follow-page" data-page-id="${page.id}" type="button">Follow</button>
        </div>
      `,
    )
    .join("");
}

function renderMetrics() {
  $("#postMetric").textContent = compact(state.posts.length);
  $("#pageMetric").textContent = compact(state.pages.length);
  $("#eventMetric").textContent = compact(state.events.length);
}

function renderAll() {
  renderStories();
  renderPosts();
  renderPages();
  renderEvents();
  renderNotifications();
  renderSuggested();
  renderMetrics();
}

async function loadData() {
  const [posts, pages, events, notifications] = await Promise.all([
    api("/api/posts"),
    api("/api/pages"),
    api("/api/events"),
    api("/api/notifications"),
  ]);

  state.posts = posts.posts;
  state.pages = pages.pages;
  state.events = events.events;
  state.notifications = notifications.notifications;

  if (state.token) {
    try {
      const { user } = await api("/api/me");
      setUser(user);
    } catch {
      state.token = "";
      localStorage.removeItem("feed_token");
    }
  }

  renderAll();
}

function switchView(viewName) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active-view"));
  $(`#${viewName}View`).classList.add("active-view");
  document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === viewName));
  $("#viewTitle").textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
}

document.body.addEventListener("click", async (event) => {
  const nav = event.target.closest("[data-view]");
  if (nav) switchView(nav.dataset.view);

  const topic = event.target.closest("[data-topic]");
  if (topic) {
    state.topic = topic.dataset.topic;
    document.querySelectorAll(".topic-tab").forEach((tab) => tab.classList.toggle("active", tab === topic));
    renderPosts();
  }

  const story = event.target.closest(".story-card");
  if (story) {
    $("#searchInput").value = story.dataset.search || "";
    switchView("home");
    renderPosts();
  }

  const discover = event.target.closest(".discover-grid button");
  if (discover) {
    $("#searchInput").value = discover.dataset.search || "";
    switchView("home");
    renderPosts();
  }

  const action = event.target.closest("[data-action]");
  if (!action) return;

  const card = action.closest(".post-card");

  try {
    if (["like", "repost", "share"].includes(action.dataset.action)) {
      await api(`/api/posts/${card.dataset.id}/${action.dataset.action}`, { method: "POST" });
      await loadData();
    }
    if (action.dataset.action === "comment") {
      card.querySelector(".comment-box")?.classList.toggle("open");
    }
    if (action.dataset.action === "reply") {
      const body = card.querySelector(".comment-box input").value.trim();
      if (!body) return;
      await api(`/api/posts/${card.dataset.id}/comments`, { method: "POST", body: JSON.stringify({ body }) });
      await loadData();
    }
    if (action.dataset.action === "follow-page") {
      await api(`/api/pages/${action.dataset.pageId}/follow`, { method: "POST" });
      await loadData();
    }
    if (action.dataset.action === "ticket") {
      await api(`/api/events/${action.dataset.eventId}/tickets`, { method: "POST" });
      await loadData();
    }
    if (action.dataset.action === "event-update") {
      await api(`/api/events/${action.dataset.eventId}/updates`, { method: "POST" });
      await loadData();
    }
  } catch (error) {
    alert(error.message);
  }
});

$("#publishPost").addEventListener("click", async () => {
  try {
    await api("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        body: $("#postText").value.trim(),
        area: $("#postArea").value,
        imageUrl: $("#postImage").value.trim(),
        commentsRestricted: $("#restrictComments").checked,
      }),
    });
    $("#postText").value = "";
    $("#postImage").value = "";
    await loadData();
  } catch (error) {
    alert(error.message);
  }
});

$("#openSignup").addEventListener("click", () => $("#signupDialog").showModal());
$("#focusComposer").addEventListener("click", () => $("#postText").focus());
$("#editProfile").addEventListener("click", () => $("#profileDialog").showModal());
$("#searchInput").addEventListener("input", renderPosts);

$("#requestCode").addEventListener("click", async () => {
  try {
    const result = await api("/api/auth/request-verification", {
      method: "POST",
      body: JSON.stringify({ email: $("#signupEmail").value, phone: $("#signupPhone").value }),
    });
    $("#emailCode").value = result.emailCode;
    $("#phoneCode").value = result.phoneCode;
    $("#signupNote").textContent = "Development mode: codes filled automatically.";
  } catch (error) {
    $("#signupNote").textContent = error.message;
  }
});

$("#signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const result = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: $("#signupName").value,
        handle: $("#signupHandle").value,
        dateOfBirth: $("#signupDob").value,
        email: $("#signupEmail").value,
        phone: $("#signupPhone").value,
        emailCode: $("#emailCode").value,
        phoneCode: $("#phoneCode").value,
        password: $("#signupPassword").value,
        wallpaperUrl: $("#signupWallpaper").value,
      }),
    });
    state.token = result.token;
    localStorage.setItem("feed_token", result.token);
    setUser(result.user);
    $("#signupDialog").close();
    await loadData();
  } catch (error) {
    $("#signupNote").textContent = error.message;
  }
});

$("#profileForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const result = await api("/api/me", {
      method: "PATCH",
      body: JSON.stringify({
        name: $("#nameInput").value,
        avatarInitials: $("#avatarInput").value,
        wallpaperUrl: $("#wallpaperInput").value,
        bio: $("#bioInput").value,
      }),
    });
    setUser(result.user);
    $("#profileDialog").close();
  } catch (error) {
    alert(error.message);
  }
});

loadData().catch((error) => {
  $("#postList").innerHTML = `<article class="post-card">Backend is not reachable: ${error.message}</article>`;
});
