// Funcionalidad para la galería mejorada
document.addEventListener('DOMContentLoaded', function() {
    // Theme: load saved theme
    const savedTheme = localStorage.getItem('galleryTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    // Theme toggle handler
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('galleryTheme', next);
            const icon = themeToggleBtn.querySelector('i');
            if (icon) icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // --- Student panel: load/save, photo upload, toggle ---
    function loadStudentData() {
        const name = localStorage.getItem('studentName');
        const email = localStorage.getItem('studentEmail');
        const phone = localStorage.getItem('studentPhone');
        const photo = localStorage.getItem('studentPhoto');

        if (name && document.getElementById('studentName')) document.getElementById('studentName').textContent = name;
        if (email && document.getElementById('studentEmail')) document.getElementById('studentEmail').textContent = email;
        if (phone && document.getElementById('inputStudentPhone')) document.getElementById('inputStudentPhone').value = phone;

        const avatar = document.getElementById('studentAvatarPlaceholder');
        if (avatar) {
            if (photo) {
                avatar.style.background = `url(${photo}) center/cover`;
                avatar.textContent = '';
                avatar.style.border = '2px solid transparent';
            } else {
                avatar.style.background = '';
                avatar.textContent = 'Sin foto';
                avatar.style.border = '2px dashed var(--gray-light)';
            }
        }

        // fill inputs
        if (document.getElementById('inputStudentName')) document.getElementById('inputStudentName').value = name || document.getElementById('studentName').textContent;
        if (document.getElementById('inputStudentEmail')) document.getElementById('inputStudentEmail').value = email || document.getElementById('studentEmail').textContent;
    }

    function initStudentPanel() {
        const toggle = document.getElementById('studentToggle');
        const arrowBtn = document.getElementById('studentArrow');
        const panel = document.getElementById('studentDetailsPanel');
        const saveBtn = document.getElementById('saveStudent');
        const cancelBtn = document.getElementById('cancelStudent');
        const photoInput = document.getElementById('studentPhotoInput');
        const avatar = document.getElementById('studentAvatarPlaceholder');

        if (!toggle || !arrowBtn || !panel) return;

        function openPanel() { panel.classList.add('active'); panel.setAttribute('aria-hidden','false'); arrowBtn.querySelector('i').className = 'fas fa-chevron-up'; }
        function closePanel(){ panel.classList.remove('active'); panel.setAttribute('aria-hidden','true'); arrowBtn.querySelector('i').className = 'fas fa-chevron-down'; }

        toggle.addEventListener('click', (e)=>{
            // If clicking avatar area directly open file dialog
            const targetIsAvatar = e.target && (e.target.id === 'studentAvatarPlaceholder' || e.target.closest && e.target.closest('#studentAvatarPlaceholder'));
            if (targetIsAvatar && photoInput) { photoInput.click(); return; }
            if (panel.classList.contains('active')) closePanel(); else openPanel();
        });

        arrowBtn.addEventListener('click',(e)=>{ e.stopPropagation(); if (panel.classList.contains('active')) closePanel(); else openPanel(); });

        if (photoInput && avatar) {
            photoInput.addEventListener('change', (e)=>{
                const f = e.target.files[0]; if (!f) return; if (!f.type.startsWith('image/')) { alert('Selecciona una imagen válida'); return; }
                if (f.size > 5*1024*1024) { alert('La imagen no debe superar 5MB'); return; }
                const reader = new FileReader(); reader.onload = (ev)=>{ const data = ev.target.result; localStorage.setItem('studentPhoto', data); avatar.style.background = `url(${data}) center/cover`; avatar.textContent = ''; avatar.style.border='2px solid transparent'; };
                reader.readAsDataURL(f);
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', ()=>{
                const name = document.getElementById('inputStudentName').value.trim();
                const email = document.getElementById('inputStudentEmail').value.trim();
                const phone = document.getElementById('inputStudentPhone').value.trim();
                if (!name || !email) { alert('Nombre y correo son requeridos'); return; }
                localStorage.setItem('studentName', name); localStorage.setItem('studentEmail', email); localStorage.setItem('studentPhone', phone);
                if (document.getElementById('studentName')) document.getElementById('studentName').textContent = name;
                if (document.getElementById('studentEmail')) document.getElementById('studentEmail').textContent = email;
                closePanel();
            });
        }

        if (cancelBtn) cancelBtn.addEventListener('click', ()=>{ loadStudentData(); closePanel(); });

        loadStudentData();
    }

    initStudentPanel();

    // Elementos del DOM
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const colButtons = document.querySelectorAll('.col-btn');
    const viewModeButtons = document.querySelectorAll('.view-mode-btn');
    const likeButtons = document.querySelectorAll('.item-likes');
    const viewButtons = document.querySelectorAll('.view-btn');
    const gallery = document.querySelector('.gallery');
    const imageCount = document.getElementById('image-count');
    const currentCols = document.getElementById('current-cols');
    
    // Modal
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeModal = document.querySelector('.close-modal');
    
    // Actualizar contador de imágenes
    imageCount.textContent = galleryItems.length;
    
    // ========================================
    // FUNCIONALIDAD DE FILTRADO
    // ========================================
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Quitar clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filtrar galería
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    item.style.display = 'flex';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Actualizar contador de imágenes visibles
            const visibleItems = document.querySelectorAll('.gallery-item[style*="display: flex"]');
            imageCount.textContent = visibleItems.length;
        });
    });
    
    // ========================================
    // CONTROL DE COLUMNAS
    // ========================================
    colButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Quitar clase active de todos los botones
            colButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const cols = this.getAttribute('data-cols');
            currentCols.textContent = cols === '4' ? 'Auto' : cols;
            
            if (cols === '4') {
                // Modo automático
                gallery.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
            } else {
                // Columnas fijas
                gallery.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            }
        });
    });
    
    // ========================================
    // CAMBIO DE VISTA (Grid/Masonry)
    // ========================================
    viewModeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Quitar clase active de todos los botones
            viewModeButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            
            if (view === 'masonry') {
                gallery.classList.add('masonry-view');
            } else {
                gallery.classList.remove('masonry-view');
            }
        });
    });
    
    // ========================================
    // FUNCIONALIDAD DE "ME GUSTA"
    // ========================================
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const currentLikes = parseInt(this.textContent.match(/\d+/)[0]);
            
            if (icon.classList.contains('far')) {
                // Cambiar a "me gusta"
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.innerHTML = `<i class="fas fa-heart"></i> ${currentLikes + 1}`;
                this.style.color = '#ff4757';
                
                // Efecto de animación
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            } else {
                // Cambiar a "no me gusta"
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.innerHTML = `<i class="far fa-heart"></i> ${currentLikes - 1}`;
                this.style.color = '';
            }
        });
    });
    
    // ========================================
    // MODAL PARA VISTA AMPLIADA
    // ========================================
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const item = this.closest('.gallery-item');
            const imgSrc = item.querySelector('img').src;
            const title = item.querySelector('h3').textContent;
            const description = item.querySelector('.overlay-content p').textContent;
            
            // Configurar modal
            modalImage.src = imgSrc;
            modalImage.alt = title;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            // Mostrar modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ========================================
    // EFECTO DE CARGA PROGRESIVA
    // ========================================
    // Configurar Intersection Observer para lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    // Aplicar lazy loading a todas las imágenes
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
        imageObserver.observe(img);
    });
});