class StepManager {
    constructor() {
        this.currentStep = 0;
        this.onSteps = {};
        this.offSteps = {};
        this.totalSteps = 3;

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

        this.onSteps[0] = this.onStep0.bind(this);
        this.onSteps[1] = this.onStep1.bind(this);
        this.onSteps[2] = this.onStep2.bind(this);

        this.offSteps[2] = this.offStep2.bind(this);

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

        for (let i = 0; i <= step; i++) {
            if (this.onSteps[i]) {
                this.onSteps[i]();
            }
        }
        for (let i = step + 1; i < this.totalSteps; i++) {
            if (this.offSteps[i]) {
                this.offSteps[i]();
            }
        }
    }

    onResize() {
        this.showStep(this.currentStep);
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
        const eksPrimary = document.querySelector('.eks-shard-0-primary .vttablet-block');
        const eksReplica = document.querySelector('.eks-shard-0-replica .vttablet-block');
        const rds = document.querySelector('.rds-cluster');
        const shard0Primary = document.querySelector('.eks-shard-0-primary');
        const shard0Replica = document.querySelector('.eks-shard-0-replica');
        const vksPrimary1 = document.querySelector('.vks-shard-1');
        const vksPrimary2 = document.querySelector('.vks-shard-2');

        const lineVksEksPrimary = document.getElementById('line-vks-eksPrimary');
        const lineVksEksReplica = document.getElementById('line-vks-eksReplica');

        this.connectElements(vksPrimary1, eksPrimary, lineVksEksPrimary, container, 20, 0, 25);
        this.connectElements(vksPrimary2, eksReplica, lineVksEksReplica, container, 20, 0, 25);

        gsap.fromTo(
            lineVksEksPrimary,
            {strokeDashoffset: 100},
            {strokeDashoffset: 1, duration: 5, xease: 'power1.inOut', yoyo: false, repeat: -1}
        );
        gsap.fromTo(
            lineVksEksReplica,
            {strokeDashoffset: 100},
            {strokeDashoffset: 1, duration: 5, xease: 'power1.inOut', yoyo: false, repeat: -1}
        );

        const lineRdsShard1Vertical = document.getElementById('line-rds-shard1-vertical');
        const lineRdsShard1Horizontal = document.getElementById('line-rds-shard1-horizontal');
        const lineRdsShard2Vertical = document.getElementById('line-rds-shard2-vertical');
        const lineRdsShard2Horizontal = document.getElementById('line-rds-shard2-horizontal');

        const rdsRect = rds.getBoundingClientRect();
        const step1Rect = document.getElementById('step-1').getBoundingClientRect();
        const step01 = document.getElementById('step01-svg');
        const offsetY = rdsRect.bottom - step1Rect.top - 20;
        step01.style.top = offsetY + 'px';
        this.connectRightAngle(rds, shard0Primary, lineRdsShard1Vertical, lineRdsShard1Horizontal, container, offsetY);
        this.connectRightAngle(rds, shard0Replica, lineRdsShard2Vertical, lineRdsShard2Horizontal, container, offsetY);
    }

    connectElements(fromEl, toEl, lineEl, containerEl, offsetX2, offsetY1, offsetY2) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const cRect = containerEl.getBoundingClientRect();

        const x1 = fromRect.right - cRect.left;
        const y1 = (fromRect.top + fromRect.bottom) / 2 - cRect.top;
        const x2 = toRect.left - cRect.left;
        const y2 = (toRect.top + toRect.bottom) / 2 - cRect.top;

        lineEl.setAttribute('x1', x1);
        lineEl.setAttribute('y1', y1 + offsetY1);
        lineEl.setAttribute('x2', x2 - offsetX2);
        lineEl.setAttribute('y2', y2 + offsetY2);
    }

    connectRightAngle(fromEl, toEl, verticalLineEl, horizontalLineEl, containerEl, offsetY) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const cRect = containerEl.getBoundingClientRect();

        const x1 = (fromRect.left + fromRect.right) / 2 - cRect.left;
        const y1 = (fromRect.top + fromRect.bottom) / 2 - cRect.top - offsetY;
        const x2 = toRect.left - 20;
        const y2 = (toRect.top + toRect.bottom) / 2 - cRect.top - offsetY;

        verticalLineEl.setAttribute('x1', x1);
        verticalLineEl.setAttribute('y1', y1);
        verticalLineEl.setAttribute('x2', x1);
        verticalLineEl.setAttribute('y2', y2);

        horizontalLineEl.setAttribute('x1', x1);
        horizontalLineEl.setAttribute('y1', y2);
        horizontalLineEl.setAttribute('x2', x2);
        horizontalLineEl.setAttribute('y2', y2);
    }

    dataFlow(el) {
        el.style.stroke = 'white';
        el.style.strokeDasharray = 10;
        el.style.strokeDashoffset = 10;
        el.style.strokeWidth = 2;
        el.style.display = 'block';
        gsap.from(
            el,
            {strokeDashoffset: 100},
            {strokeDashoffset: 1, duration: 5, ease: 'power1', yoyo:false, repeat: -1}
        );
    }

    dataFlowAll() {
        const lineVksEksPrimary = document.getElementById('line-vks-eksPrimary');
        const lineVksEksReplica = document.getElementById('line-vks-eksReplica');
        const lineRdsShard1Vertical = document.getElementById('line-rds-shard1-vertical');
        const lineRdsShard1Horizontal = document.getElementById('line-rds-shard1-horizontal');
        const lineRdsShard2Vertical = document.getElementById('line-rds-shard2-vertical');
        const lineRdsShard2Horizontal = document.getElementById('line-rds-shard2-horizontal');
        this.dataFlow(lineVksEksPrimary);
        this.dataFlow(lineVksEksReplica);
        this.dataFlow(lineRdsShard1Vertical);
        this.dataFlow(lineRdsShard1Horizontal);
        this.dataFlow(lineRdsShard2Vertical);
        this.dataFlow(lineRdsShard2Horizontal);
        lineRdsShard1Horizontal.style.markerEnd = 'url(#arrow)';
        lineRdsShard2Horizontal.style.markerEnd = 'url(#arrow)';
        lineRdsShard2Vertical.style.markerStart = 'url(#arrow-reversed)';
        lineRdsShard1Vertical.style.markerStart = 'url(#arrow-reversed)';
    }

    dbLink(el) {
        el.style.stroke = '#444';
        el.style.strokeDasharray = 0;
        el.style.strokeDashoffset = 0;
        el.style.strokeWidth = 1;
    }

    dbLinkAll() {
        const lineRdsShard1Vertical = document.getElementById('line-rds-shard1-vertical');
        const lineRdsShard1Horizontal = document.getElementById('line-rds-shard1-horizontal');
        const lineRdsShard2Vertical = document.getElementById('line-rds-shard2-vertical');
        const lineRdsShard2Horizontal = document.getElementById('line-rds-shard2-horizontal');
        this.dbLink(lineRdsShard1Vertical);
        this.dbLink(lineRdsShard1Horizontal);
        this.dbLink(lineRdsShard2Vertical);
        this.dbLink(lineRdsShard2Horizontal);
        lineRdsShard1Horizontal.style.markerEnd = '';
        lineRdsShard2Horizontal.style.markerEnd = '';
    }

    onStep0() {
        this.positionAndAnimateArrow0();
    }

    onStep1() {
        this.positionStep1Arrows()
        this.dbLinkAll()

    }

    onStep2() {
        this.dataFlowAll()
        document.querySelectorAll('.sidecar-icon').forEach(icon => {
            icon.style.display = 'block';
        });
        const lineVksEksPrimary = document.getElementById('line-vks-eksPrimary');
        const lineVksEksReplica = document.getElementById('line-vks-eksReplica');
        lineVksEksPrimary.style.markerEnd = 'none';
        lineVksEksReplica.style.markerEnd = 'none';
    }

    offStep2() {
        const lineVksEksPrimary = document.getElementById('line-vks-eksPrimary');
        const lineVksEksReplica = document.getElementById('line-vks-eksReplica');
        lineVksEksPrimary.style.display = 'none';
        lineVksEksReplica.style.display = 'none';
        document.querySelectorAll('.sidecar-icon').forEach(icon => {
            icon.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StepManager();
});