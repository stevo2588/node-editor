import { NodeModel } from "./model";


export class ImplementedEventModel extends NodeModel {
  static readonly type = 'implementedEvent';
  readonly defaultInputs = [];
  readonly additionalInputs = [];
  readonly defaultOutputs = [ImplementedEventModel];
  readonly additionalOutputs = [];

  model = { };

	get schema() { return { }};
	get displayType() { return 'Implemented Event' };

  constructor() {
    super(false, ImplementedEventModel.type, 'untitled', 'red');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class CodeModel extends NodeModel {
  static readonly type = 'code';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = {
    location: '/home/stevo',
  };

	get schema() { return {
    location: {
      type: String,
      label: 'File Path',
    },
  } }

	get displayType() { return 'Code' };

  constructor() {
    super(false, CodeModel.type, 'untitled', 'blue');
    this.model.location = '/home/stevo';
  }

	public get outputs() {
		return []; // TODO
	}
}

export class CodeGenModel extends NodeModel {
  static readonly type = 'codeGen';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [CodeModel, ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'Code Generator' };

  constructor() {
    super(false, CodeGenModel.type, 'untitled', 'blue');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class TestModel extends NodeModel {
  static readonly type = 'test';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'Test' };

  constructor() {
    super(false, TestModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class BuildModel extends NodeModel {
  static readonly type = 'build';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'Build' };

  constructor() {
    super(false, BuildModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceModel extends NodeModel {
  static readonly type = 'service';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'Service' };

  constructor() {
    super(false, ServiceModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceHostModel extends NodeModel {
  static readonly type = 'serviceHost';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'Service Host' };

  constructor() {
    super(false, ServiceHostModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ApiMapperModel extends NodeModel {
  static readonly type = 'apiMapper';
  static readonly root = true;
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'API Mapper' };

  constructor() {
    super(false, ApiMapperModel.type, 'untitled', 'purple');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class CodeContainerModel extends NodeModel {
  static readonly type = 'codeContainer';
  static readonly contains = ['code', 'codeGen'];
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'Code Container' };

  constructor() {
    super(true, CodeContainerModel.type, 'untitled', 'blue');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class BuildContainerModel extends NodeModel {
  static readonly type = 'buildContainer';
  static readonly root = true;
  static readonly contains = ['test', 'build', 'codeContainer'];
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'Build Container' };

  constructor() {
    super(true, BuildContainerModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceContainerModel extends NodeModel {
  static readonly type = 'serviceContainer';
  static readonly root = true;
  static readonly contains = ['service', 'serviceHost', 'apiMapper', 'serviceContainer'];
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return 'Service Container' };

  constructor() {
    super(true, ServiceContainerModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}
