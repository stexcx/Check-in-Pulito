// ===== HOTEL MANAGEMENT APP =====

class HotelApp {
    constructor() {
        this.data = {
            stats: {
                occupiedRooms: 24,
                checkinsToday: 8,
                roomsToClean: 12,
                todayRevenue: 2450
            },
            rooms: [],
            bookings: [],
            guests: [],
            cleaningTasks: []
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupPeriodicUpdates();
        this.initializeComponents();
        this.setupNotifications();
    }
    
    // Data Management
    loadData() {
        // Load from localStorage or API
        const savedData = localStorage.getItem('hotelAppData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this.data = { ...this.data, ...parsedData };
            } catch (error) {
                console.warn('Error loading saved data:', error);
                this.initializeDefaultData();
            }
        } else {
            this.initializeDefaultData();
        }
        
        this.updateUI();
    }
    
    saveData() {
        try {
            localStorage.setItem('hotelAppData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Errore nel salvataggio dati', 'error');
        }
    }
    
    initializeDefaultData() {
        // Initialize with sample data
        this.data.rooms = this.generateSampleRooms();
        this.data.bookings = this.generateSampleBookings();
        this.data.guests = this.generateSampleGuests();
        this.data.cleaningTasks = this.generateSampleCleaningTasks();
    }
    
    generateSampleRooms() {
        const rooms = [];
        for (let i = 101; i <= 150; i++) {
            rooms.push({
                id: i,
                number: i,
                type: i <= 120 ? 'standard' : i <= 140 ? 'deluxe' : 'suite',
                status: Math.random() > 0.5 ? 'occupied' : 'available',
                cleanliness: ['clean', 'dirty', 'in_progress'][Math.floor(Math.random() * 3)],
                lastCleaned: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString()
            });
        }
        return rooms;
    }
    
    generateSampleBookings() {
        // Generate sample bookings
        return [
            {
                id: 'BK001',
                guestName: 'Mario Rossi',
                roomNumber: 101,
                checkIn: new Date().toISOString().split('T')[0],
                checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                status: 'confirmed'
            },
            {
                id: 'BK002',
                guestName: 'Anna Verdi',
                roomNumber: 102,
                checkIn: new Date().toISOString().split('T')[0],
                checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                status: 'checked_in'
            }
        ];
    }
    
    generateSampleGuests() {
        return [
            {
                id: 'G001',
                name: 'Mario Rossi',
                email: 'mario.rossi@email.com',
                phone: '+39 123 456 7890',
                preferences: ['quiet_room', 'high_floor'],
                vip: false
            },
            {
                id: 'G002',
                name: 'Anna Verdi',
                email: 'anna.verdi@email.com',
                phone: '+39 098 765 4321',
                preferences: ['city_view', 'late_checkout'],
                vip: true
            }
        ];
    }
    
    generateSampleCleaningTasks() {
        return [
            {
                id: 'CT001',
                roomNumber: 103,
                type: 'checkout_cleaning',
                priority: 'high',
                assignedTo: 'Maria',
                status: 'pending',
                estimatedTime: 45,
                createdAt: new Date().toISOString()
            },
            {
                id: 'CT002',
                roomNumber: 104,
                type: 'maintenance_cleaning',
                priority: 'medium',
                assignedTo: 'Giulia',
                status: 'in_progress',
                estimatedTime: 30,
                createdAt: new Date(Date.now() - 3600000).toISOString()
            }
        ];
    }
    
    // UI Updates
    updateUI() {
        this.updateStats();
        this.updateDateTime();
    }
    
    updateStats() {
        // Update statistics cards
        const statElements = {
            occupiedRooms: document.querySelector('.stat-card:nth-child(1) h3'),
            checkinsToday: document.querySelector('.stat-card:nth-child(2) h3'),
            roomsToClean: document.querySelector('.stat-card:nth-child(3) h3'),
            todayRevenue: document.querySelector('.stat-card:nth-child(4) h3')
        };
        
        if (statElements.occupiedRooms) {
            statElements.occupiedRooms.textContent = this.data.stats.occupiedRooms;
        }
        if (statElements.checkinsToday) {
            statElements.checkinsToday.textContent = this.data.stats.checkinsToday;
        }
        if (statElements.roomsToClean) {
            statElements.roomsToClean.textContent = this.data.stats.roomsToClean;
        }
        if (statElements.todayRevenue) {
            statElements.todayRevenue.textContent = `€${this.data.stats.todayRevenue.toLocaleString()}`;
        }
    }
    
    updateDateTime() {
        // Could add a real-time clock if needed
        const now = new Date();
        const timeString = now.toLocaleTimeString('it-IT');
        const dateString = now.toLocaleDateString('it-IT');
        
        // Update if there's a datetime display element
        const datetimeEl = document.getElementById('current-datetime');
        if (datetimeEl) {
            datetimeEl.textContent = `${dateString} - ${timeString}`;
        }
    }
    
    // Event Listeners
    setupEventListeners() {
        // Quick action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleQuickAction(e);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });
        
        // Visibility change (for pausing/resuming updates)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });
    }
    
    handleQuickAction(event) {
        const button = event.currentTarget;
        const action = this.getActionFromButton(button);
        
        // Add loading state
        this.setButtonLoading(button, true);
        
        // Simulate async operation
        setTimeout(() => {
            this.executeQuickAction(action);
            this.setButtonLoading(button, false);
        }, 1000);
    }
    
    getActionFromButton(button) {
        const text = button.textContent.trim();
        const actionMap = {
            'Nuova Prenotazione': 'new_booking',
            'Check-in Ospite': 'checkin_guest',
            'Check-out Ospite': 'checkout_guest',
            'Manutenzione': 'maintenance'
        };
        
        return actionMap[text] || 'unknown';
    }
    
    executeQuickAction(action) {
        switch(action) {
            case 'new_booking':
                this.showNotification('Funzione prenotazione in sviluppo', 'info');
                break;
            case 'checkin_guest':
                this.showNotification('Funzione check-in in sviluppo', 'info');
                break;
            case 'checkout_guest':
                this.showNotification('Funzione check-out in sviluppo', 'info');
                break;
            case 'maintenance':
                this.showNotification('Funzione manutenzione in sviluppo', 'info');
                break;
            default:
                this.showNotification('Azione non riconosciuta', 'warning');
        }
    }
    
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<div class="loading"></div> Caricamento...';
        } else {
            button.disabled = false;
            // Restore original content
            const originalContent = button.dataset.originalContent;
            if (originalContent) {
                button.innerHTML = originalContent;
            }
        }
    }
    
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + key combinations
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case '1':
                    event.preventDefault();
                    window.navigationManager?.openSection('dashboard');
                    break;
                case '2':
                    event.preventDefault();
                    window.navigationManager?.openSection('prenotazioni');
                    break;
                case '3':
                    event.preventDefault();
                    window.navigationManager?.openSection('camere');
                    break;
                case 's':
                    event.preventDefault();
                    this.saveData();
                    this.showNotification('Dati salvati', 'success');
                    break;
            }
        }
    }
    
    // Periodic Updates
    setupPeriodicUpdates() {
        // Update every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateDateTime();
            // Could fetch new data from server here
        }, 30000);
    }
    
    pauseUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
    
    resumeUpdates() {
        this.setupPeriodicUpdates();
    }
    
    // Initialize Components
    initializeComponents() {
        // Store original button content for loading states
        document.querySelectorAll('.action-btn').forEach(button => {
            button.dataset.originalContent = button.innerHTML;
        });
        
        // Add tooltips or other interactive elements
        this.setupTooltips();
    }
    
    setupTooltips() {
        // Simple tooltip implementation
        const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
        elementsWithTooltips.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip);
            element.addEventListener('mouseleave', this.hideTooltip);
        });
    }
    
    showTooltip(event) {
        const element = event.currentTarget;
        const tooltipText = element.dataset.tooltip;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--gray-800);
            color: var(--white);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        element._tooltip = tooltip;
    }
    
    hideTooltip(event) {
        const element = event.currentTarget;
        if (element._tooltip) {
            document.body.removeChild(element._tooltip);
            delete element._tooltip;
        }
    }
    
    // Notifications
    setupNotifications() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 2000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--white);
            border-left: 4px solid var(--${type === 'error' ? 'accent' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'secondary'}-color);
            padding: 16px;
            margin-bottom: 12px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease-out;
            cursor: pointer;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>${message}</span>
                <button style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; margin-left: 12px;">&times;</button>
            </div>
        `;
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        container.appendChild(notification);
        
        // Auto remove after duration
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        // Manual close
        notification.addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }
    
    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
    
    // Public API methods
    getData() {
        return { ...this.data };
    }
    
    updateStats(newStats) {
        this.data.stats = { ...this.data.stats, ...newStats };
        this.updateUI();
        this.saveData();
    }
    
    destroy() {
        // Cleanup when app is destroyed
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        this.saveData();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hotelApp = new HotelApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HotelApp;
}
