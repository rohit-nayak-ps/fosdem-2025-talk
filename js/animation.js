class StepManager {
    constructor() {
        this.steps = {};
        this.currentStep = 0;
        this.init();
    }

    init() {
        document.querySelectorAll('.step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetStep = parseInt(btn.getAttribute('data-step'));
                this.showStep(targetStep);
            });
        });

        window.addEventListener('resize', () => this.onResize());

        // Initialize steps
        this.steps[0] = this.positionAndAnimateArrow0.bind(this);
        this.steps[1] = this.positionStep1Arrows.bind(this);

        // Show initial step
        this.showStep(0);
    }

    showStep(step) {
        this.currentStep = step;
        document.querySelectorAll('.step-block').forEach(block => {
            const blockStep = parseInt(block.getAttribute('data-step'));
            if (blockStep <= step) {
                block.classList.add('show');
            } else {
                block.classList.remove('show');
            }
        });

        if (this.steps[step]) {
            this.steps[step]();
        }
    }

    onResize() {
        if (this.steps[this.currentStep]) {
            this.steps[this.currentStep]();
        }
    }

    positionAndAnimateArrow0() {
        const container = document.querySelector('.diagram-container');
        const userApp = document.querySelector('.user-app');
        const rds = document.querySelector('.rds-cluster');
        const arrowLine = document.getElementById('dynamic-arrow');

        const containerRect = container.getBoundingClientRect();
        const userRect = userApp.getBoundingClientRect();
        const rdsRect = rds.getBoundingClientRect();

        const x1 = (userRect.right - containerRect.left);
        const y1 = ((userRect.top + userRect.bottom) / 2) - containerRect.top;
        const x2 = (rdsRect.left - containerRect.left);
        const y2 = ((rdsRect.top + rdsRect.bottom) / 2) - containerRect.top;

        arrowLine.setAttribute('x1', x1);
        arrowLine.setAttribute('y1', y1);
        arrowLine.setAttribute('x2', x2);
        arrowLine.setAttribute('y2', y2);

        gsap.fromTo(
            arrowLine,
            {strokeDashoffset: 100},
            {
                strokeDashoffset: 1,
                duration: 5,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            }
        );
    }

    positionStep1Arrows() {
        const container = document.querySelector('#step-1 .diagram-container');
        const vtgate = document.querySelector('.vtgate-block');
        const etcd = document.querySelector('.etcd-block');
        const vtorc = document.querySelector('.vtorc-block');
        const vtctld = document.querySelector('.vtctld-block');
        const shard1Tablet = document.querySelector('.shard-1 .vttablet-block');
        const shard2Tablet = document.querySelector('.shard-2 .vttablet-block');
        const rds = document.querySelector('.rds-cluster');
        const shard1 = document.querySelector('.shard-1');
        const shard2 = document.querySelector('.shard-2');

        const lineVtgateShard1 = document.getElementById('line-vtgate-shard1');
        const lineVtgateShard2 = document.getElementById('line-vtgate-shard2');


        this.connectElements(vtgate, shard1Tablet, lineVtgateShard1, container, 20, -5);
        this.connectElements(vtgate, shard2Tablet, lineVtgateShard2, container, 20, 5);

        gsap.fromTo(
            lineVtgateShard1,
            {strokeDashoffset: 100},
            {strokeDashoffset: 1, duration: 5, ease: 'power1.inOut', yoyo: true, repeat: -1}
        );
        gsap.fromTo(
            lineVtgateShard2,
            {strokeDashoffset: 100},
            {strokeDashoffset: 1, duration: 5, ease: 'power1.inOut', yoyo: true, repeat: -1}
        );

        const lineRdsShard1Vertical = document.getElementById('line-rds-shard1-vertical');
        const lineRdsShard1Horizontal = document.getElementById('line-rds-shard1-horizontal');
        const lineRdsShard2Vertical = document.getElementById('line-rds-shard2-vertical');
        const lineRdsShard2Horizontal = document.getElementById('line-rds-shard2-horizontal');

        this.connectRightAngle(rds, shard1, lineRdsShard1Vertical, lineRdsShard1Horizontal, container);
        this.connectRightAngle(rds, shard2, lineRdsShard2Vertical, lineRdsShard2Horizontal, container);
    }


    connectElements(fromEl, toEl, lineEl, containerEl, offsetX, offsetY) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const cRect = containerEl.getBoundingClientRect();

        const x1 = fromRect.right - cRect.left;
        const y1 = (fromRect.top + fromRect.bottom) / 2 - cRect.top;
        const x2 = toRect.left - cRect.left;
        const y2 = (toRect.top + toRect.bottom) / 2 - cRect.top;

        lineEl.setAttribute('x1', x1 );
        lineEl.setAttribute('y1', y1 + offsetY);
        lineEl.setAttribute('x2', x2 - offsetX);
        lineEl.setAttribute('y2', y2 );
    }

    connectRightAngle(fromEl, toEl, verticalLineEl, horizontalLineEl, containerEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const cRect = containerEl.getBoundingClientRect();

        const x1 = (fromRect.left + fromRect.right) / 2 - cRect.left;
        const y1 = (fromRect.top + fromRect.bottom) / 2 - cRect.top;
        const x2 = (toRect.left + toRect.right) / 2 - cRect.left;
        const y2 = (toRect.top + toRect.bottom) / 2 - cRect.top;

        verticalLineEl.setAttribute('x1', x1);
        verticalLineEl.setAttribute('y1', y1);
        verticalLineEl.setAttribute('x2', x1);
        verticalLineEl.setAttribute('y2', y2);

        horizontalLineEl.setAttribute('x1', x1);
        horizontalLineEl.setAttribute('y1', y2);
        horizontalLineEl.setAttribute('x2', x2);
        horizontalLineEl.setAttribute('y2', y2);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    new StepManager();
});