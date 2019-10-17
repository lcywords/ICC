export class Display {
    userProductMap = {
        rtstation: false,
        rtcenter: false,
        rtsuite: false,
        rtremote: false,
        datuyun: false,
        // dtmonitor: false,
        dtbridge: false
    };

    displayUserProductMap = {
        rtstation: 'rtStation',
        rtcenter: 'rtCenter',
        rtsuite: 'rtSuite',
        rtremote: 'rtRemote',
        datuyun: 'datuyun',
        // dtmonitor: 'dtMonitor',
        dtbridge: 'dtBridge'
    };

    userAuthorityMap = {
        rtstation: [
            { key: 'patient_add', value: false },
            { key: 'patient_edit', value: false },
            { key: 'patient_delete', value: false }
        ],
        rtcenter: [
            { key: 'patient_register', value: false },
            { key: 'patient_edit', value: false },
            { key: 'patient_delete', value: false },
            { key: 'task_delete', value: false }
        ]
    };
    userAuthorityIndexs = {
        rtstation: 0,
        rtcenter: 1
    };
    userTypeList = ['doctor', 'physician', 'nurse', 'technician', 'admin'];
}

