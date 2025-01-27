class StepManager {
    constructor() {
        this.currentStep = 0;
        this.onSteps = {};
        this.offSteps = {};
        this.totalSteps = 6

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
        this.onSteps[3] = this.onStep3.bind(this);
        this.onSteps[4] = this.onStep4.bind(this);
        this.onSteps[5] = this.onStep5.bind(this);


        this.offSteps[2] = this.offStep2.bind(this);
        this.offSteps[3] = this.offStep3.bind(this);
        this.offSteps[4] = this.offStep4.bind(this);
        this.offSteps[5] = this.offStep5.bind(this);

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
        this.updateStepButtonColors(step);
    }

    onResize() {
        this.showStep(this.currentStep);
    }

    updateStepButtonColors(currentStep) {
        const buttons = document.querySelectorAll('.step-btn');
        buttons.forEach((button, index) => {
            if (index <= currentStep) {
                if (index === currentStep) {
                    button.classList.add('current-step');
                } else {
                    button.classList.remove('current-step');
                }
                button.style.backgroundColor = `#F05E19`;
            } else {
                button.classList.remove('current-step');
                button.style.backgroundColor = '#777';
            }
        });
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

    setRoutingRules(fromArray, toArray) {
        const tbody = document.getElementById('routing-rules-body');
        tbody.innerHTML = ''; // Clear existing rows
        for (let i = 0; i < fromArray.length; i++) {
            const row = document.createElement('tr');
            const fromCell = document.createElement('td');
            const toCell = document.createElement('td');

            fromCell.textContent = fromArray[i];
            toCell.textContent = toArray[i];

            row.appendChild(fromCell);
            row.appendChild(toCell);
            tbody.appendChild(row);
        }
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
            {strokeDashoffset: 1, duration: 5, ease: 'power1.inOut', yoyo: false, repeat: -1}
        );
        gsap.fromTo(
            lineVksEksReplica,
            {strokeDashoffset: 100},
            {strokeDashoffset: 1, duration: 5, ease: 'power1.inOut', yoyo: false, repeat: -1}
        );

        const lineRdsShard1Vertical = document.getElementById('line-rds-shard1-vertical');
        const lineRdsShard1Horizontal = document.getElementById('line-rds-shard1-horizontal');
        const lineRdsShard2Vertical = document.getElementById('line-rds-shard2-vertical');
        const lineRdsShard2Horizontal = document.getElementById('line-rds-shard2-horizontal');

        const rdsRect = rds.getBoundingClientRect();
        const step1Rect = document.getElementById('step-1').getBoundingClientRect();
        const step01 = document.getElementById('step01-svg');
        const offsetY = rdsRect.bottom - step1Rect.top -20;
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
        gsap.fromTo(
            el,
            {strokeDashoffset: 100},
            {strokeDashoffset: 1, duration: 5, ease: 'power1', yoyo: true, repeat: -1}
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

    // rds cluster
    onStep0() {
        this.positionAndAnimateArrow0();
        document.getElementById('mysql-protocol-text').style.display = 'block';
        document.getElementById('mysql-protocol-text-rds').style.display = 'none';
    }

    // Vitess cluster
    onStep1() {
        this.positionStep1Arrows()
        this.dbLinkAll()
        const rds = document.querySelector('.rds-cluster');
        rds.style.display = 'block';
        this.showWorkflows()

    }

    // Start Migration
    onStep2() {
        this.dataFlowAll()
        document.querySelectorAll('.sidecar-icon').forEach(icon => {
            icon.style.display = 'block';
        });
        const lineVksEksPrimary = document.getElementById('line-vks-eksPrimary');
        const lineVksEksReplica = document.getElementById('line-vks-eksReplica');
        lineVksEksPrimary.style.markerEnd = 'none';
        lineVksEksReplica.style.markerEnd = 'none';
        document.querySelector('.routing-rules').style.display = 'block';
        this.setRoutingRules(
            ['t1', 't1@primary', 't1@replica', 'eks.t1', 'eks.t1@primary', 'eks.t1@replica','vks.t1', 'vks.t1@primary', 'vks.t1@replica'],
            ['eks.t1', 'eks.t1@primary', 'eks.t1@replica', 'eks.t1', 'eks.t1@primary', 'eks.t1@replica','eks.t1', 'eks.t1@primary', 'eks.t1@replica']
        );
        document.querySelector('.denied-tables').style.display = 'block';
        document.getElementById('mysql-protocol-text-rds').style.display = 'block';
        document.getElementById('vevents-text').style.display = 'block';

    }

    offStep2() {
        const lineVksEksPrimary = document.getElementById('line-vks-eksPrimary');
        const lineVksEksReplica = document.getElementById('line-vks-eksReplica');
        lineVksEksPrimary.style.display = 'none';
        lineVksEksReplica.style.display = 'none';
        document.querySelectorAll('.sidecar-icon').forEach(icon => {
            icon.style.display = 'none';
        });
        const extLines = document.querySelectorAll('.ext-lines');
        for (let i = 0; i < extLines.length; i++) {
            extLines[i].style.stroke = '#333';
        }
        document.getElementById('vevents-text').style.display = 'none';

    }

    // switch reads
    onStep3() {
        const step3 = document.getElementById('step3-svg');
        const rds = document.querySelector('.rds-cluster');
        const rdsRect = rds.getBoundingClientRect();
        const step1Rect = document.getElementById('step-1').getBoundingClientRect();
        const offsetY = rdsRect.top - step1Rect.top - 10;
        step3.style.top = offsetY + 'px';
        this.positionAndAnimateArrow3();
        this.positionAndAnimateArrowVtgateToVks();
        const rdsLine = document.getElementById('dynamic-arrow')
        rdsLine.style.display = 'none';
        this.setRoutingRules(
            ['t1', 't1@primary', 't1@replica', 'eks.t1', 'eks.t1@primary', 'eks.t1@replica','vks.t1', 'vks.t1@primary', 'vks.t1@replica'],
            ['eks.t1', 'eks.t1@primary', 'vks.t1@replica', 'eks.t1', 'eks.t1@primary', 'vks.t1@replica','eks.t1', 'eks.t1@primary', 'vks.t1@replica']
        );
        const grpcText = document.getElementById('grpc-text');
        grpcText.style.display = 'block';
        const txt = document.getElementById('mysql-protocol-text')
        txt.style.display = 'none';
        const step4 = document.getElementById('step4-svg');
        const offset4Y = rdsRect.top - step1Rect.top - 10;
        step4.style.top = offset4Y + 'px';
        this.positionAndAnimateArrowVtgateToRds();
        const extLines = document.querySelectorAll('.ext-lines');
        for (let i = 0; i < extLines.length; i++) {
            extLines[i].style.stroke = 'cyan';
        }

    }

    positionAndAnimateArrowVtgateToVks() {
        const container = document.querySelector('.diagram-container');
        const vtgate = document.querySelector('.vtgate-block');
        const vksShard1 = document.querySelector('.vks-shard-1');
        const vksShard2 = document.querySelector('.vks-shard-2');
        const arrowLine1 = document.getElementById('line-vtgate-vksShard1');
        const arrowLine2 = document.getElementById('line-vtgate-vksShard2');

        this.connectElements(vtgate, vksShard1, arrowLine1, container, 0, -60, -50);
        this.connectElements(vtgate, vksShard2, arrowLine2, container, 0, -40, -50);

        arrowLine1.style.display = 'block';
        arrowLine2.style.display = 'block';
        arrowLine1.style.markerEnd = 'none';
        arrowLine2.style.markerEnd = 'none';

        gsap.fromTo(
            arrowLine1,
            {strokeDashoffset: 100},
            {
                strokeDashoffset: 1,
                duration: 5,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true
            }
        );

        gsap.fromTo(
            arrowLine2,
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

    offStep3() {
        const lineUserVtgate = document.getElementById('line-user-vtgate');
        const lineVtgateVksShard1 = document.getElementById('line-vtgate-vksShard1');
        const lineVtgateVksShard2 = document.getElementById('line-vtgate-vksShard2');
        lineUserVtgate.style.display = 'none';
        lineUserVtgate.style.markerStart = '';
        lineVtgateVksShard1.style.display = 'none';
        lineVtgateVksShard2.style.display = 'none';
        const rdsLine = document.getElementById('dynamic-arrow')
        rdsLine.style.display = 'block';
        const textElement = document.getElementById('mysql-protocol-text-user-vtgate');
        textElement.style.display = 'none';
        const grpcText = document.getElementById('grpc-text');
        grpcText.style.display = 'none';
        const txt = document.getElementById('mysql-protocol-text')
        txt.style.display = 'block';
        const arrowLine = document.getElementById('line-vtgate-rds');
        arrowLine.style.display = 'none';
    }

    // switch writes
    offStep4() {
        const arrowLine1 = document.getElementById('line-vtgate-vksShard1');
        const arrowLine2 = document.getElementById('line-vtgate-vksShard2');
        arrowLine1.style.markerEnd = 'none';
        arrowLine2.style.markerEnd = 'none';
        const deniedTables = document.querySelector('.denied-tables');
        deniedTables.style.right = '55%';
        deniedTables.style.top = '0px';
        const reverseSideCar = document.querySelector('.reverse-sidecar-icon');
        reverseSideCar.style.display = 'none';

    }

    onStep4() {
        const rdsLine = document.getElementById('dynamic-arrow')
        rdsLine.style.display = 'none';
        const arrowLine1 = document.getElementById('line-vtgate-vksShard1');
        const arrowLine2 = document.getElementById('line-vtgate-vksShard2');
        arrowLine1.style.markerEnd = 'url(#arrow)';
        arrowLine2.style.markerEnd = 'url(#arrow)';
        this.setRoutingRules(
            ['t1', 't1@primary', 't1@replica', 'eks.t1', 'eks.t1@primary', 'eks.t1@replica','vks.t1', 'vks.t1@primary', 'vks.t1@replica'],
            ['vks.t1', 'vks.t1@primary', 'vks.t1@replica', 'vks.t1', 'vks.t1@primary', 'vks.t1@replica','vks.t1', 'vks.t1@primary', 'vks.t1@replica']
        );
        const deniedTables = document.querySelector('.denied-tables');
        deniedTables.style.right = '80px';
        deniedTables.style.top = '120px';
        document.getElementById('mysql-protocol-text').style.display = 'none';
        document.getElementById('mysql-protocol-text-rds').style.display = 'none';
        const reverseSideCar = document.querySelector('.reverse-sidecar-icon');
        reverseSideCar.style.display = 'block';
        const arrowLine = document.getElementById('line-vtgate-rds');
        arrowLine.style.display = 'none';
    }

    showWorkflows() {
        const workflows = document.querySelectorAll('.workflow');
        workflows.forEach(workflow => {
            workflow.style.display = 'block';
        });
    }

    hideWorkflows() {
        const workflows = document.querySelectorAll('.workflow');
        workflows.forEach(workflow => {
            workflow.style.display = 'none';
        });
    }

    offStep5() {
        const rds = document.querySelector('.rds-cluster');
        rds.style.display = 'block';
        this.showWorkflows();
    }

    // complete
    onStep5() {
        const rds = document.querySelector('.rds-cluster');
        rds.style.display = 'none';
        this.hideWorkflows();
        document.querySelector('.denied-tables').style.display = 'none';
        document.querySelector('.routing-rules').style.display = 'none';
        const sidecars = document.querySelectorAll('.sidecar-icon');
        sidecars.forEach(sidecar => {
            sidecar.style.display = 'none';
        });

    }

    positionAndAnimateArrow3() {
        const container = document.querySelector('.diagram-container');
        const userApp = document.querySelector('.user-app');
        const vtgate = document.querySelector('.vtgate-block');
        const arrowLine = document.getElementById('line-user-vtgate');

        const containerRect = container.getBoundingClientRect();
        const userRect = userApp.getBoundingClientRect();
        const vtgateRect = vtgate.getBoundingClientRect();

        const x1 = userRect.left + ((userRect.right - userRect.left) / 2) - 10;
        const y1 = ((userRect.top + userRect.bottom) / 2) - containerRect.top + 20;
        const x2 = vtgateRect.left + ((vtgateRect.right - vtgateRect.left) / 2) - 20;
        const y2 = vtgateRect.top - containerRect.top - 40;

        arrowLine.setAttribute('x1', x1);
        arrowLine.setAttribute('y1', y1);
        arrowLine.setAttribute('x2', x2);
        arrowLine.setAttribute('y2', y2);

        arrowLine.style.display = 'block';

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
        const textElement = document.getElementById('mysql-protocol-text-user-vtgate');
        const textX = (x1 + x2) / 2;
        const textY = (y1 + y2) / 2;
        textElement.setAttribute('x', textX);
        textElement.setAttribute('y', textY);
        textElement.style.display = 'block';
    }

    positionAndAnimateArrowVtgateToRds() {
        const container = document.querySelector('.diagram-container');
        const vtgate = document.querySelector('.vtgate-block');
        const eks = document.querySelector('.eks-shard-0-primary');
        const arrowLine = document.getElementById('line-vtgate-rds');

        const containerRect = container.getBoundingClientRect();
        const vtgateRect = vtgate.getBoundingClientRect();
        const eksRect = eks.getBoundingClientRect();

        const x1 = vtgateRect.right;
        const y1 = (vtgateRect.top + vtgateRect.bottom) / 2 - 2 * containerRect.top;
        const x2 = eksRect.left - containerRect.left;
        const y2 = (eksRect.top + eksRect.bottom) / 2 - containerRect.top;

        arrowLine.setAttribute('x1', x1);
        arrowLine.setAttribute('y1', y1);
        arrowLine.setAttribute('x2', x2);
        arrowLine.setAttribute('y2', y2);

        arrowLine.style.display = 'block';

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
}

document.addEventListener('DOMContentLoaded', () => {
    new StepManager();
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('mysql-protocol-text-rds').style.display = 'none';
});