export class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.setupForm();
    }

    setupForm() {
        this.form?.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupValidation();
    }

    setupValidation() {
        const inputs = this.form?.querySelectorAll('input, textarea');
        inputs?.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
        });
    }

    validateField(field) {
        let isValid = true;
        const errorElement = this.getOrCreateErrorElement(field);

        switch(field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                errorElement.textContent = isValid ? '' : 'Please enter a valid email address';
                break;
            case 'text':
                isValid = field.value.length >= 2;
                errorElement.textContent = isValid ? '' : 'This field is required';
                break;
            case 'textarea':
                isValid = field.value.length >= 10;
                errorElement.textContent = isValid ? '' : 'Please enter at least 10 characters';
                break;
        }

        field.classList.toggle('invalid', !isValid);
        return isValid;
    }

    getOrCreateErrorElement(field) {
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        return errorElement;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showSuccess();
                this.form?.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    showSuccess() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Message sent successfully! We\'ll get back to you soon.';
        this.form?.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }

    showError(errorMessage) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.textContent = errorMessage;
        this.form?.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }
} 