import { NodeModel } from "./model";


export class ImplementedEventModel extends NodeModel {
  static readonly type = 'implementedEvent';
  static readonly displayType = 'Event';
  readonly defaultInputs = [];
  readonly additionalInputs = [];
  readonly defaultOutputs = [ImplementedEventModel];
  readonly additionalOutputs = [];

  model = { };

	get schema() { return { }};
	get displayType() { return ImplementedEventModel.displayType };

  constructor() {
    super(false, ImplementedEventModel.type, 'untitled', 'red');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ApiModel extends NodeModel {
  static readonly type = 'api';
  static readonly displayType = 'API';
  readonly defaultInputs = [];
  readonly additionalInputs = [];
  readonly defaultOutputs = [ApiModel];
  readonly additionalOutputs = [];

  model = { };

	get schema() { return { }};
	get displayType() { return ApiModel.displayType };

  constructor() {
    super(false, ApiModel.type, 'untitled', 'red');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ArtifactModel extends NodeModel {
  static readonly type = 'artifact';
  static readonly displayType = 'Artifact';
  readonly defaultInputs = [];
  readonly additionalInputs = [];
  readonly defaultOutputs = [ArtifactModel];
  readonly additionalOutputs = [];

  model = { };

	get schema() { return { }};
	get displayType() { return ArtifactModel.displayType };

  constructor() {
    super(false, ArtifactModel.type, 'untitled', 'red');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}



export class CodeModel extends NodeModel {
  static readonly type = 'code';
  static readonly displayType = 'Code';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel];

  model = {
    location: null,
  };

	get schema() { return {
    location: {
      type: String,
      label: 'File Path',
    },
  } }

	get displayType() { return CodeModel.displayType; };

  constructor() {
    super(false, CodeModel.type, 'untitled', 'blue');
  }

  async codeEffect() {
    console.log('code effect');
    console.log(this.compiledData);
  }

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }
}

export class CodeGenModel extends NodeModel {
  static readonly type = 'codeGen';
  static readonly displayType = 'Code Gen';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [CodeModel, ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return CodeGenModel.displayType };

  constructor() {
    super(false, CodeGenModel.type, 'untitled', 'blue');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class TestModel extends NodeModel {
  static readonly type = 'test';
  static readonly displayType = 'Test';
  readonly defaultInputs = [CodeModel];
  readonly additionalInputs = [CodeModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = []; // pass through?

  model = { };
	get schema() { return { }};
	get displayType() { return TestModel.displayType };

  constructor() {
    super(false, TestModel.type, 'untitled', 'yellow');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class BuildModel extends NodeModel {
  static readonly type = 'build';
  static readonly displayType = 'Build';
  readonly defaultInputs = [CodeModel, ImplementedEventModel, ApiModel];
  readonly additionalInputs = [CodeModel, ImplementedEventModel, ApiModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [ImplementedEventModel, ApiModel, ArtifactModel];

  model = { };
	get schema() { return { }};
	get displayType() { return BuildModel.displayType };

  constructor() {
    super(false, BuildModel.type, 'untitled', 'yellow');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceModel extends NodeModel {
  static readonly type = 'service';
  static readonly displayType = 'Service';
  readonly defaultInputs = [];
  readonly additionalInputs = [];
  readonly defaultOutputs = [ImplementedEventModel, ApiModel];
  readonly additionalOutputs = [];

  model = { };
	get schema() { return { }};
	get displayType() { return ServiceModel.displayType };

  constructor() {
    super(false, ServiceModel.type, 'untitled', 'green');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    const api = { name: 'api' };
    return { outputs: [{ type: ApiModel.type, value: api }], data: api };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceHostModel extends NodeModel {
  static readonly type = 'serviceHost';
  static readonly displayType = 'Service Host';
  readonly defaultInputs = [ArtifactModel];
  readonly additionalInputs = [ArtifactModel];
  readonly defaultOutputs = [];
  readonly additionalOutputs = [ImplementedEventModel, ApiModel];

  model = { };
	get schema() { return { }};
	get displayType() { return ServiceHostModel.displayType };

  constructor() {
    super(false, ServiceHostModel.type, 'untitled', 'green');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ApiMapperModel extends NodeModel {
  static readonly type = 'apiMapper';
  static readonly displayType = 'API Mapper';
  static readonly root = true;
  readonly defaultInputs = [];
  readonly additionalInputs = [ApiModel];
  readonly defaultOutputs = [];
  readonly additionalOutputs = [];

  model = { };
	get schema() { return { }};
	get displayType() { return ApiMapperModel.displayType };

  constructor() {
    super(false, ApiMapperModel.type, 'untitled', 'purple');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return {
      outputs: inputs.filter(i => i.value && i.type === ApiModel.type).map(i => ({ type: i.type, value: {} })),
      data: {},
    };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class CodeContainerModel extends NodeModel {
  static readonly type = 'codeContainer';
  static readonly displayType = 'Code';
  static readonly contains = ['code', 'codeGen'];
  readonly defaultInputs = [];
  readonly additionalInputs = [ImplementedEventModel, ApiModel];
  readonly defaultOutputs = [CodeModel];
  readonly additionalOutputs = [CodeModel, ImplementedEventModel];

  model = { };
	get schema() { return { }};
	get displayType() { return CodeContainerModel.displayType };

  constructor() {
    super(true, CodeContainerModel.type, 'untitled', 'blue');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class BuildContainerModel extends NodeModel {
  static readonly type = 'buildContainer';
  static readonly displayType = 'Build';
  static readonly contains = ['test', 'build', 'codeContainer'];
  readonly defaultInputs = [];
  readonly additionalInputs = [];
  readonly defaultOutputs = [];
  readonly additionalOutputs = [ArtifactModel];

  model = { };
	get schema() { return { }};
	get displayType() { return BuildContainerModel.displayType };

  constructor() {
    super(true, BuildContainerModel.type, 'untitled', 'yellow');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceContainerModel extends NodeModel {
  static readonly type = 'serviceContainer';
  static readonly displayType = 'Service';
  static readonly root = true;
  static readonly contains = ['service', 'serviceHost', 'apiMapper', 'serviceContainer', 'buildContainer'];
  readonly defaultInputs = [];
  readonly additionalInputs = [ImplementedEventModel, ApiModel];
  readonly defaultOutputs = [];
  readonly additionalOutputs = [ImplementedEventModel, ApiModel];

  model = { };
	get schema() { return { }};
	get displayType() { return ServiceContainerModel.displayType };

  constructor() {
    super(true, ServiceContainerModel.type, 'untitled', 'green');
  }

  async codeEffect() {}

  compile(inputs: { type: string, value: any }[], config: NodeModel['model']) {
    // TODO
    return { outputs: [], data: {} };
  }

	public get outputs() {
		return []; // TODO
	}
}
