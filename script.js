// 数据存储键名
const BOOKS_KEY = 'myBooks';
const MOVIES_KEY = 'myMovies';
const TRAVELS_KEY = 'myTravels';

// 当前页面状态
let currentPage = 'home';
let currentTab = 'books';

// 图片预览数据（临时存储）
let imagePreviewData = {
    bookImage: null,
    movieImage: null,
    travelImage: null
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    loadMovies();
    loadTravels();
});

// ========== 页面导航 ==========

// Tab切换
function switchTab(tab) {
    currentTab = tab;
    
    // 更新tab按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // 更新tab内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tab === 'books') {
        document.getElementById('booksContent').classList.add('active');
    } else if (tab === 'movies') {
        document.getElementById('moviesContent').classList.add('active');
    } else if (tab === 'travels') {
        document.getElementById('travelsContent').classList.add('active');
    }
}

// 显示页面
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName).classList.add('active');
    currentPage = pageName;
}

// 返回首页
function goBack() {
    showPage('homePage');
    // 恢复之前的tab状态
    switchTab(currentTab);
}

// ========== 书籍管理 ==========

// 加载书籍
function loadBooks() {
    const books = getBooks();
    const list = document.getElementById('booksList');
    
    if (books.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📖</div>
                <div class="empty-state-text">还没有添加任何书籍<br>点击右上角按钮开始记录吧</div>
            </div>
        `;
        return;
    }
    
    list.innerHTML = books.map((book, index) => createBookItem(book, index)).join('');
}

// 创建书籍列表项
function createBookItem(book, index) {
    const date = book.date ? new Date(book.date).toLocaleDateString('zh-CN') : '未记录';
    const rating = book.rating ? `⭐ ${book.rating}` : '';
    const preview = book.notes ? truncateText(book.notes, 100) : '';
    const image = book.image ? `<img src="${book.image}" alt="${escapeHtml(book.title)}" class="record-item-image">` : '';
    
    return `
        <div class="record-item" onclick="showBookDetail(${index})">
            ${image}
            <div class="record-item-header">
                <div>
                    <div class="record-item-title">${escapeHtml(book.title)}</div>
                    <div class="record-item-meta">作者：${escapeHtml(book.author)}</div>
                </div>
            </div>
            <div class="record-item-date">${date}</div>
            ${rating ? `<div class="record-item-rating">${rating}</div>` : ''}
            ${preview ? `<div class="record-item-preview">${escapeHtml(preview)}</div>` : ''}
            <div class="record-item-actions" onclick="event.stopPropagation()">
                <button class="btn-action" onclick="editBook(${index})">编辑</button>
                <button class="btn-action" onclick="deleteBook(${index})">删除</button>
            </div>
        </div>
    `;
}

// 显示书籍详情
function showBookDetail(index) {
    const books = getBooks();
    const book = books[index];
    
    if (!book) return;
    
    const date = book.date ? new Date(book.date).toLocaleDateString('zh-CN') : '未记录';
    const rating = book.rating ? `<div class="detail-rating">⭐ ${book.rating}</div>` : '';
    const notes = book.notes ? `<div class="detail-notes">${escapeHtml(book.notes)}</div>` : '<div class="detail-notes" style="color: var(--text-muted);">暂无读书笔记</div>';
    const image = book.image ? `<img src="${book.image}" alt="${escapeHtml(book.title)}" class="detail-image">` : '';
    
    const detailHTML = `
        ${image}
        <h1 class="detail-title">${escapeHtml(book.title)}</h1>
        <div class="detail-meta">作者：${escapeHtml(book.author)}</div>
        <div class="detail-date">阅读日期：${date}</div>
        ${rating}
        ${notes}
        <div class="detail-actions">
            <button class="btn-action" onclick="editBook(${index}); goBack();">编辑</button>
            <button class="btn-action" onclick="deleteBook(${index}); goBack();">删除</button>
        </div>
    `;
    
    document.getElementById('bookDetailContent').innerHTML = detailHTML;
    showPage('bookDetailPage');
}

// 获取所有书籍
function getBooks() {
    const books = localStorage.getItem(BOOKS_KEY);
    return books ? JSON.parse(books) : [];
}

// 保存书籍
function saveBooks(books) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

// 打开书籍模态框
function openBookModal(index = null) {
    const modal = document.getElementById('bookModal');
    const form = document.getElementById('bookForm');
    const title = document.getElementById('bookModalTitle');
    
    // 重置图片预览
    imagePreviewData.bookImage = null;
    document.getElementById('bookImagePreview').innerHTML = '';
    document.getElementById('bookImage').value = '';
    
    if (index !== null) {
        // 编辑模式
        const books = getBooks();
        const book = books[index];
        title.textContent = '编辑书籍';
        document.getElementById('bookId').value = index;
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookDate').value = book.date || '';
        document.getElementById('bookRating').value = book.rating || '';
        document.getElementById('bookNotes').value = book.notes || '';
        
        // 显示已有图片
        if (book.image) {
            imagePreviewData.bookImage = book.image;
            showImagePreview('bookImagePreview', book.image, 'bookImage');
        }
    } else {
        // 添加模式
        title.textContent = '添加书籍';
        form.reset();
        document.getElementById('bookId').value = '';
    }
    
    modal.classList.add('show');
}

// 关闭书籍模态框
function closeBookModal() {
    const modal = document.getElementById('bookModal');
    modal.classList.remove('show');
    document.getElementById('bookForm').reset();
    imagePreviewData.bookImage = null;
    document.getElementById('bookImagePreview').innerHTML = '';
}

// 保存书籍（表单提交）
function saveBook(event) {
    event.preventDefault();
    
    const books = getBooks();
    const id = document.getElementById('bookId').value;
    const book = {
        title: document.getElementById('bookTitle').value.trim(),
        author: document.getElementById('bookAuthor').value.trim(),
        date: document.getElementById('bookDate').value,
        rating: document.getElementById('bookRating').value ? parseFloat(document.getElementById('bookRating').value) : null,
        notes: document.getElementById('bookNotes').value.trim(),
        image: imagePreviewData.bookImage || null
    };
    
    if (id === '') {
        // 添加新书籍
        books.push(book);
    } else {
        // 更新现有书籍（保留原有图片如果没有新图片）
        if (!imagePreviewData.bookImage && books[parseInt(id)].image) {
            book.image = books[parseInt(id)].image;
        }
        books[parseInt(id)] = book;
    }
    
    saveBooks(books);
    loadBooks();
    closeBookModal();
}

// 编辑书籍
function editBook(index) {
    openBookModal(index);
}

// 删除书籍
function deleteBook(index) {
    if (confirm('确定要删除这本书吗？')) {
        const books = getBooks();
        books.splice(index, 1);
        saveBooks(books);
        loadBooks();
        
        // 如果当前在详情页，返回首页
        if (currentPage === 'bookDetailPage') {
            goBack();
        }
    }
}

// ========== 电影管理 ==========

// 加载电影
function loadMovies() {
    const movies = getMovies();
    const list = document.getElementById('moviesList');
    
    if (movies.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎬</div>
                <div class="empty-state-text">还没有添加任何电影<br>点击右上角按钮开始记录吧</div>
            </div>
        `;
        return;
    }
    
    list.innerHTML = movies.map((movie, index) => createMovieItem(movie, index)).join('');
}

// 创建电影列表项
function createMovieItem(movie, index) {
    const date = movie.date ? new Date(movie.date).toLocaleDateString('zh-CN') : '未记录';
    const rating = movie.rating ? `⭐ ${movie.rating}` : '';
    const director = movie.director ? `导演：${escapeHtml(movie.director)}` : '';
    const preview = movie.notes ? truncateText(movie.notes, 100) : '';
    const image = movie.image ? `<img src="${movie.image}" alt="${escapeHtml(movie.title)}" class="record-item-image">` : '';
    
    return `
        <div class="record-item" onclick="showMovieDetail(${index})">
            ${image}
            <div class="record-item-header">
                <div>
                    <div class="record-item-title">${escapeHtml(movie.title)}</div>
                    ${director ? `<div class="record-item-meta">${director}</div>` : ''}
                </div>
            </div>
            <div class="record-item-date">${date}</div>
            ${rating ? `<div class="record-item-rating">${rating}</div>` : ''}
            ${preview ? `<div class="record-item-preview">${escapeHtml(preview)}</div>` : ''}
            <div class="record-item-actions" onclick="event.stopPropagation()">
                <button class="btn-action" onclick="editMovie(${index})">编辑</button>
                <button class="btn-action" onclick="deleteMovie(${index})">删除</button>
            </div>
        </div>
    `;
}

// 显示电影详情
function showMovieDetail(index) {
    const movies = getMovies();
    const movie = movies[index];
    
    if (!movie) return;
    
    const date = movie.date ? new Date(movie.date).toLocaleDateString('zh-CN') : '未记录';
    const director = movie.director ? `<div class="detail-meta">导演：${escapeHtml(movie.director)}</div>` : '';
    const rating = movie.rating ? `<div class="detail-rating">⭐ ${movie.rating}</div>` : '';
    const notes = movie.notes ? `<div class="detail-notes">${escapeHtml(movie.notes)}</div>` : '<div class="detail-notes" style="color: var(--text-muted);">暂无观影感想</div>';
    const image = movie.image ? `<img src="${movie.image}" alt="${escapeHtml(movie.title)}" class="detail-image">` : '';
    
    const detailHTML = `
        ${image}
        <h1 class="detail-title">${escapeHtml(movie.title)}</h1>
        ${director}
        <div class="detail-date">观看日期：${date}</div>
        ${rating}
        ${notes}
        <div class="detail-actions">
            <button class="btn-action" onclick="editMovie(${index}); goBack();">编辑</button>
            <button class="btn-action" onclick="deleteMovie(${index}); goBack();">删除</button>
        </div>
    `;
    
    document.getElementById('movieDetailContent').innerHTML = detailHTML;
    showPage('movieDetailPage');
}

// 获取所有电影
function getMovies() {
    const movies = localStorage.getItem(MOVIES_KEY);
    return movies ? JSON.parse(movies) : [];
}

// 保存电影
function saveMovies(movies) {
    localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
}

// 打开电影模态框
function openMovieModal(index = null) {
    const modal = document.getElementById('movieModal');
    const form = document.getElementById('movieForm');
    const title = document.getElementById('movieModalTitle');
    
    // 重置图片预览
    imagePreviewData.movieImage = null;
    document.getElementById('movieImagePreview').innerHTML = '';
    document.getElementById('movieImage').value = '';
    
    if (index !== null) {
        // 编辑模式
        const movies = getMovies();
        const movie = movies[index];
        title.textContent = '编辑电影';
        document.getElementById('movieId').value = index;
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('movieDirector').value = movie.director || '';
        document.getElementById('movieDate').value = movie.date || '';
        document.getElementById('movieRating').value = movie.rating || '';
        document.getElementById('movieNotes').value = movie.notes || '';
        
        // 显示已有图片
        if (movie.image) {
            imagePreviewData.movieImage = movie.image;
            showImagePreview('movieImagePreview', movie.image, 'movieImage');
        }
    } else {
        // 添加模式
        title.textContent = '添加电影';
        form.reset();
        document.getElementById('movieId').value = '';
    }
    
    modal.classList.add('show');
}

// 关闭电影模态框
function closeMovieModal() {
    const modal = document.getElementById('movieModal');
    modal.classList.remove('show');
    document.getElementById('movieForm').reset();
    imagePreviewData.movieImage = null;
    document.getElementById('movieImagePreview').innerHTML = '';
}

// 保存电影（表单提交）
function saveMovie(event) {
    event.preventDefault();
    
    const movies = getMovies();
    const id = document.getElementById('movieId').value;
    const movie = {
        title: document.getElementById('movieTitle').value.trim(),
        director: document.getElementById('movieDirector').value.trim(),
        date: document.getElementById('movieDate').value,
        rating: document.getElementById('movieRating').value ? parseFloat(document.getElementById('movieRating').value) : null,
        notes: document.getElementById('movieNotes').value.trim(),
        image: imagePreviewData.movieImage || null
    };
    
    if (id === '') {
        // 添加新电影
        movies.push(movie);
    } else {
        // 更新现有电影（保留原有图片如果没有新图片）
        if (!imagePreviewData.movieImage && movies[parseInt(id)].image) {
            movie.image = movies[parseInt(id)].image;
        }
        movies[parseInt(id)] = movie;
    }
    
    saveMovies(movies);
    loadMovies();
    closeMovieModal();
}

// 编辑电影
function editMovie(index) {
    openMovieModal(index);
}

// 删除电影
function deleteMovie(index) {
    if (confirm('确定要删除这部电影吗？')) {
        const movies = getMovies();
        movies.splice(index, 1);
        saveMovies(movies);
        loadMovies();
        
        // 如果当前在详情页，返回首页
        if (currentPage === 'movieDetailPage') {
            goBack();
        }
    }
}

// ========== 旅行见闻管理 ==========

// 加载旅行见闻
function loadTravels() {
    const travels = getTravels();
    const list = document.getElementById('travelsList');
    
    if (travels.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✈️</div>
                <div class="empty-state-text">还没有添加任何旅行见闻<br>点击右上角按钮开始记录吧</div>
            </div>
        `;
        return;
    }
    
    list.innerHTML = travels.map((travel, index) => createTravelItem(travel, index)).join('');
}

// 创建旅行见闻列表项
function createTravelItem(travel, index) {
    const date = travel.date ? new Date(travel.date).toLocaleDateString('zh-CN') : '未记录';
    const location = travel.location ? `<div class="record-item-meta">📍 ${escapeHtml(travel.location)}</div>` : '';
    const preview = travel.notes ? truncateText(travel.notes, 100) : '';
    const image = travel.image ? `<img src="${travel.image}" alt="${escapeHtml(travel.title)}" class="record-item-image">` : '';
    
    return `
        <div class="record-item" onclick="showTravelDetail(${index})">
            ${image}
            <div class="record-item-header">
                <div>
                    <div class="record-item-title">${escapeHtml(travel.title)}</div>
                    ${location}
                </div>
            </div>
            <div class="record-item-date">${date}</div>
            ${preview ? `<div class="record-item-preview">${escapeHtml(preview)}</div>` : ''}
            <div class="record-item-actions" onclick="event.stopPropagation()">
                <button class="btn-action" onclick="editTravel(${index})">编辑</button>
                <button class="btn-action" onclick="deleteTravel(${index})">删除</button>
            </div>
        </div>
    `;
}

// 显示旅行见闻详情
function showTravelDetail(index) {
    const travels = getTravels();
    const travel = travels[index];
    
    if (!travel) return;
    
    const date = travel.date ? new Date(travel.date).toLocaleDateString('zh-CN') : '未记录';
    const location = travel.location ? `<div class="detail-meta">📍 ${escapeHtml(travel.location)}</div>` : '';
    const notes = travel.notes ? `<div class="detail-notes">${escapeHtml(travel.notes)}</div>` : '<div class="detail-notes" style="color: var(--text-muted);">暂无旅行见闻</div>';
    const image = travel.image ? `<img src="${travel.image}" alt="${escapeHtml(travel.title)}" class="detail-image">` : '';
    
    const detailHTML = `
        ${image}
        <h1 class="detail-title">${escapeHtml(travel.title)}</h1>
        ${location}
        <div class="detail-date">旅行日期：${date}</div>
        ${notes}
        <div class="detail-actions">
            <button class="btn-action" onclick="editTravel(${index}); goBack();">编辑</button>
            <button class="btn-action" onclick="deleteTravel(${index}); goBack();">删除</button>
        </div>
    `;
    
    document.getElementById('travelDetailContent').innerHTML = detailHTML;
    showPage('travelDetailPage');
}

// 获取所有旅行见闻
function getTravels() {
    const travels = localStorage.getItem(TRAVELS_KEY);
    return travels ? JSON.parse(travels) : [];
}

// 保存旅行见闻
function saveTravels(travels) {
    localStorage.setItem(TRAVELS_KEY, JSON.stringify(travels));
}

// 打开旅行见闻模态框
function openTravelModal(index = null) {
    const modal = document.getElementById('travelModal');
    const form = document.getElementById('travelForm');
    const title = document.getElementById('travelModalTitle');
    
    // 重置图片预览
    imagePreviewData.travelImage = null;
    document.getElementById('travelImagePreview').innerHTML = '';
    document.getElementById('travelImage').value = '';
    
    if (index !== null) {
        // 编辑模式
        const travels = getTravels();
        const travel = travels[index];
        title.textContent = '编辑旅行见闻';
        document.getElementById('travelId').value = index;
        document.getElementById('travelTitle').value = travel.title;
        document.getElementById('travelLocation').value = travel.location || '';
        document.getElementById('travelDate').value = travel.date || '';
        document.getElementById('travelNotes').value = travel.notes || '';
        
        // 显示已有图片
        if (travel.image) {
            imagePreviewData.travelImage = travel.image;
            showImagePreview('travelImagePreview', travel.image, 'travelImage');
        }
    } else {
        // 添加模式
        title.textContent = '添加旅行见闻';
        form.reset();
        document.getElementById('travelId').value = '';
    }
    
    modal.classList.add('show');
}

// 关闭旅行见闻模态框
function closeTravelModal() {
    const modal = document.getElementById('travelModal');
    modal.classList.remove('show');
    document.getElementById('travelForm').reset();
    imagePreviewData.travelImage = null;
    document.getElementById('travelImagePreview').innerHTML = '';
}

// 保存旅行见闻（表单提交）
function saveTravel(event) {
    event.preventDefault();
    
    const travels = getTravels();
    const id = document.getElementById('travelId').value;
    const travel = {
        title: document.getElementById('travelTitle').value.trim(),
        location: document.getElementById('travelLocation').value.trim(),
        date: document.getElementById('travelDate').value,
        notes: document.getElementById('travelNotes').value.trim(),
        image: imagePreviewData.travelImage || null
    };
    
    if (id === '') {
        // 添加新旅行见闻
        travels.push(travel);
    } else {
        // 更新现有旅行见闻（保留原有图片如果没有新图片）
        if (!imagePreviewData.travelImage && travels[parseInt(id)].image) {
            travel.image = travels[parseInt(id)].image;
        }
        travels[parseInt(id)] = travel;
    }
    
    saveTravels(travels);
    loadTravels();
    closeTravelModal();
}

// 编辑旅行见闻
function editTravel(index) {
    openTravelModal(index);
}

// 删除旅行见闻
function deleteTravel(index) {
    if (confirm('确定要删除这条旅行见闻吗？')) {
        const travels = getTravels();
        travels.splice(index, 1);
        saveTravels(travels);
        loadTravels();
        
        // 如果当前在详情页，返回首页
        if (currentPage === 'travelDetailPage') {
            goBack();
        }
    }
}

// ========== 图片处理 ==========

// 处理图片上传
function handleImageUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const file = input.files[0];
    
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        input.value = '';
        return;
    }
    
    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        
        // 存储到对应的预览数据
        if (inputId === 'bookImage') {
            imagePreviewData.bookImage = base64;
        } else if (inputId === 'movieImage') {
            imagePreviewData.movieImage = base64;
        } else if (inputId === 'travelImage') {
            imagePreviewData.travelImage = base64;
        }
        
        showImagePreview(previewId, base64, inputId);
    };
    
    reader.readAsDataURL(file);
}

// 显示图片预览
function showImagePreview(previewId, imageSrc, inputId) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = `
        <img src="${imageSrc}" alt="预览">
        <button type="button" class="remove-image" onclick="removeImage('${previewId}', '${inputId}')">×</button>
    `;
}

// 移除图片
function removeImage(previewId, inputId) {
    document.getElementById(previewId).innerHTML = '';
    document.getElementById(inputId).value = '';
    
    if (inputId === 'bookImage') {
        imagePreviewData.bookImage = null;
    } else if (inputId === 'movieImage') {
        imagePreviewData.movieImage = null;
    } else if (inputId === 'travelImage') {
        imagePreviewData.travelImage = null;
    }
}

// ========== 工具函数 ==========

// HTML转义，防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 截断文本
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const bookModal = document.getElementById('bookModal');
    const movieModal = document.getElementById('movieModal');
    const travelModal = document.getElementById('travelModal');
    
    if (event.target === bookModal) {
        closeBookModal();
    }
    if (event.target === movieModal) {
        closeMovieModal();
    }
    if (event.target === travelModal) {
        closeTravelModal();
    }
}
