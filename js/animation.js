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

        const lineVtgateShard1 = document.getElementById('line-vtgate-shard1');
        const lineVtgateShard2 = document.getElementById('line-vtgate-shard2');
        const lineVtorcEtcd = document.getElementById('line-vtorc-etcd');
        const lineVtgateEtcd = document.getElementById('line-vtgate-etcd');
        const lineVtctldEtcd = document.getElementById('line-vtctld-etcd');
        const lineVtctldShard1 = document.getElementById('line-vtctld-shard1');
        const lineVtctldShard2 = document.getElementById('line-vtctld-shard2');

        this.connectElements(vtgate, shard1Tablet, lineVtgateShard1, container);
        this.connectElements(vtgate, shard2Tablet, lineVtgateShard2, container);
        this.connectElements(vtorc, etcd, lineVtorcEtcd, container);
        this.connectElements(vtgate, etcd, lineVtgateEtcd, container);
        this.connectElements(vtctld, etcd, lineVtctldEtcd, container);
        this.connectElements(vtctld, shard1Tablet, lineVtctldShard1, container);
        this.connectElements(vtctld, shard2Tablet, lineVtctldShard2, container);

        gsap.fromTo(
            lineVtgateShard1,
            {strokeDashoffset: 100},
            {strokeDashoffset: 0, duration: 1, ease: 'power1.inOut'}
        );
        gsap.fromTo(
            lineVtgateShard2,
            {strokeDashoffset: 100},
            {strokeDashoffset: 0, duration: 1, ease: 'power1.inOut'}
        );
    }

    connectElements(fromEl, toEl, lineEl, containerEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const cRect = containerEl.getBoundingClientRect();

        const x1 = (fromRect.left + fromRect.right) / 2 - cRect.left;
        const y1 = (fromRect.top + fromRect.bottom) / 2 - cRect.top;
        const x2 = (toRect.left + toRect.right) / 2 - cRect.left;
        const y2 = (toRect.top + toRect.bottom) / 2 - cRect.top;

        lineEl.setAttribute('x1', x1);
        lineEl.setAttribute('y1', y1);
        lineEl.setAttribute('x2', x2);
        lineEl.setAttribute('y2', y2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StepManager();
});