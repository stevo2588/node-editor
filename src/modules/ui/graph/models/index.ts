import { NodeModel } from "./model";


export class ImplementedEventModel extends NodeModel {
  static readonly type = 'implementedEvent';
  readonly defaultInputs = [];
  readonly additionalInputs = [];
  readonly defaultOutputs = [ImplementedEventModel];
  readonly additionalOutputs = [];

  constructor() {
    super(false, CodeModel.type, 'untitled', 'blue');
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

  constructor() {
    super(false, CodeModel.type, 'untitled', 'blue');
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

  constructor() {
    super(true, ServiceContainerModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}
